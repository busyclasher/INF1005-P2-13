<?php
// bookings.php
require_once __DIR__ . '/cors.php';
apply_cors_headers();
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
require_once __DIR__ . '/security_headers.php';
apply_api_security_headers();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/booking_email.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper function to sanitize string inputs
function sanitizeInput($data) {
    if (is_string($data)) {
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
    return $data;
}

if ($method === 'POST') {
    // CREATE: Make a booking
    $payload = require_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input['user_id'] != $payload['sub']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        exit();
    }
    

    if (!$input || !isset($input['session_id']) || !isset($input['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'session_id and user_id are required.']);
        exit();
    }

    $sessionId = filter_var($input['session_id'], FILTER_VALIDATE_INT);
    $userId = filter_var($input['user_id'], FILTER_VALIDATE_INT);

    if ($sessionId === false || $userId === false) {
        echo json_encode(['success' => false, 'error' => 'Invalid session_id or user_id format.']);
        exit();
    }

    try {
        // Start transaction for data integrity
        $conn->begin_transaction();

        // 1. Check spots_booked and max_capacity with a lock FOR UPDATE
        // This prevents race conditions if multiple users book at the exactly same time
        $checkStmt = $conn->prepare("
            SELECT s.spots_booked, c.max_capacity 
            FROM sessions s
            JOIN classes c ON s.class_id = c.class_id
            WHERE s.session_id = ?
            FOR UPDATE
        ");
        $checkStmt->bind_param("i", $sessionId);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if ($result->num_rows === 0) {
            throw new Exception("Session not found.");
        }

        $row = $result->fetch_assoc();
        
        // Check if there are spots available
        if ($row['spots_booked'] >= $row['max_capacity']) {
            throw new Exception("Sorry, this session is fully booked.");
        }

        // 2. Check if the user already booked this session to prevent duplicate bookings
        $dupStmt = $conn->prepare("SELECT booking_id FROM bookings WHERE session_id = ? AND user_id = ?");
        $dupStmt->bind_param("ii", $sessionId, $userId);
        $dupStmt->execute();
        if ($dupStmt->get_result()->num_rows > 0) {
            throw new Exception("You have already booked this session.");
        }

        // 3. Insert the new booking
        $insertStmt = $conn->prepare("INSERT INTO bookings (session_id, user_id) VALUES (?, ?)");
        $insertStmt->bind_param("ii", $sessionId, $userId);
        $insertStmt->execute();
        if ($insertStmt->affected_rows !== 1) {
            throw new Exception("Failed to create booking record.");
        }

        // 4. Update the spots_booked count
        $updateStmt = $conn->prepare("UPDATE sessions SET spots_booked = spots_booked + 1 WHERE session_id = ?");
        $updateStmt->bind_param("i", $sessionId);
        $updateStmt->execute();
        if ($updateStmt->affected_rows !== 1) {
            throw new Exception("Failed to update session capacity.");
        }

        // Commit transaction if everything succeeded
        $conn->commit();

        // Send booking confirmation email
        $userStmt = $conn->prepare("SELECT first_name, last_name, email_address FROM users WHERE user_id = ?");
        $userStmt->bind_param("i", $userId);
        $userStmt->execute();
        $userRow = $userStmt->get_result()->fetch_assoc();
        $userStmt->close();

        $classStmt = $conn->prepare("
            SELECT c.title, s.session_date, s.start_time, c.duration_mins
            FROM sessions s
            JOIN classes c ON s.class_id = c.class_id
            WHERE s.session_id = ?
        ");
        $classStmt->bind_param("i", $sessionId);
        $classStmt->execute();
        $classRow = $classStmt->get_result()->fetch_assoc();
        $classStmt->close();

        $emailResult = ['success' => false, 'error' => 'Email skipped.'];
        if ($userRow && $classRow) {
            $emailResult = sendBookingConfirmationEmail(
                $userRow['email_address'],
                $userRow['first_name'],
                $userRow['last_name'],
                $classRow['title'],
                $classRow['session_date'],
                $classRow['start_time'],
                $classRow['duration_mins']
            );
        } else {
            $emailResult = ['success' => false, 'error' => 'Booking saved, but user/class details were not found for email.'];
        }

        echo json_encode([
            'success' => true, 
            'message' => 'Booking confirmed successfully!',
            'booking_id' => $insertStmt->insert_id,
            'email_sent' => $emailResult['success'],
            'email_error' => $emailResult['success'] ? null : ($emailResult['error'] ?? 'Unknown email error')
        ]);
        
    } catch (Throwable $e) {
        $conn->rollback();
        $safe = [
            'Session not found.',
            'Sorry, this session is fully booked.',
            'You have already booked this session.',
            'Failed to create booking record.',
            'Failed to update session capacity.',
        ];
        $error = api_public_error_from_exception(
            $e,
            $safe,
            'Booking could not be completed. Please try again.'
        );
        echo json_encode(['success' => false, 'error' => $error]);
    }
} elseif ($method === 'GET') {
    // READ: Get bookings for a user
    $payload = require_auth();
    $userId = filter_input(INPUT_GET, 'user_id', FILTER_VALIDATE_INT);

    if ($userId != $payload['sub']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Unauthorized to view other users bookings']);
        exit();
    }
    
    if (!$userId) {
        echo json_encode(['success' => false, 'error' => 'user_id is required.']);
        exit();
    }

    try {
        $stmt = $conn->prepare("
            SELECT b.booking_id, b.booking_time, s.session_date, s.start_time, c.title, c.duration_mins
            FROM bookings b
            JOIN sessions s ON b.session_id = s.session_id
            JOIN classes c ON s.class_id = c.class_id
            WHERE b.user_id = ?
            ORDER BY s.session_date DESC, s.start_time DESC
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $bookings = [];
        while ($row = $result->fetch_assoc()) {
            // Sanitize output just in case (e.g., class title has weird chars)
            $row['title'] = sanitizeInput($row['title']);
            $bookings[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $bookings]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch bookings.']);
    }
} elseif ($method === 'DELETE') {
    // DELETE: Cancel a booking
    $payload = require_auth();
    $input = json_decode(file_get_contents('php://input'), true);

    if ($input['user_id'] != $payload['sub']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        exit();
    }

    if (!$input || !isset($input['booking_id']) || !isset($input['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'booking_id and user_id are required.']);
        exit();
    }

    $bookingId = filter_var($input['booking_id'], FILTER_VALIDATE_INT);
    $userId = filter_var($input['user_id'], FILTER_VALIDATE_INT);

    if (!$bookingId || !$userId) {
        echo json_encode(['success' => false, 'error' => 'Invalid booking_id or user_id.']);
        exit();
    }

    try {
        $conn->begin_transaction();

        // Check if booking exists and belongs to user
        $stmt = $conn->prepare("SELECT session_id FROM bookings WHERE booking_id = ? AND user_id = ? FOR UPDATE");
        $stmt->bind_param("ii", $bookingId, $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            throw new Exception("Booking not found or you don't have permission to cancel it.");
        }
        
        $row = $result->fetch_assoc();
        $sessionId = $row['session_id'];

        // Delete booking
        $delStmt = $conn->prepare("DELETE FROM bookings WHERE booking_id = ?");
        $delStmt->bind_param("i", $bookingId);
        $delStmt->execute();

        // Decrement spots_booked
        $updateStmt = $conn->prepare("UPDATE sessions SET spots_booked = spots_booked - 1 WHERE session_id = ?");
        $updateStmt->bind_param("i", $sessionId);
        $updateStmt->execute();

        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Booking cancelled successfully.']);

    } catch (Throwable $e) {
        $conn->rollback();
        $error = api_public_error_from_exception(
            $e,
            ['Booking not found or you don\'t have permission to cancel it.'],
            'We could not cancel this booking. Please try again.'
        );
        echo json_encode(['success' => false, 'error' => $error]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
?>

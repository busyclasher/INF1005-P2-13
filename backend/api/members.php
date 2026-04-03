<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/cors.php';
apply_cors_headers();
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
require_once __DIR__ . '/security_headers.php';
apply_api_security_headers();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

// Admin-only endpoint
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['user_id']) || !isset($data['role'])) {
        echo json_encode(['success' => false, 'error' => 'Missing parameters']);
        exit();
    }

    $allowedRoles = ['member', 'admin'];
    if (!in_array($data['role'], $allowedRoles, true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid role']);
        exit();
    }

    $userId = filter_var($data['user_id'], FILTER_VALIDATE_INT);
    if ($userId === false || $userId < 1) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid user ID']);
        exit();
    }

    $role = $data['role'];
    $stmt = $conn->prepare("UPDATE users SET role = ? WHERE user_id = ?");
    $stmt->bind_param("si", $role, $userId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update role']);
    }

    $stmt->close();
    $conn->close();
    exit();
}

// Get all members with their membership information
// LEFT JOIN to get the earliest membership start date as the join date
$stmt = $conn->prepare("
    SELECT 
        u.user_id, 
        u.first_name, 
        u.last_name, 
        u.email_address, 
        u.phone_number, 
        u.role,
        m.start_date as join_date,
        mp.plan_name as membership_tier,
        mp.price as membership_price
    FROM users u
    LEFT JOIN memberships m ON u.user_id = m.user_id
    LEFT JOIN membership_plans mp ON m.plan_id = mp.plan_id
    WHERE u.role IN ('member', 'admin')
    ORDER BY m.start_date DESC
");
$stmt->execute();
$result = $stmt->get_result();

$members = [];
while ($row = $result->fetch_assoc()) {
    // Count bookings for this user
    $bookingCount = 0;
    $bookingsStmt = $conn->prepare("SELECT COUNT(*) as count FROM bookings WHERE user_id = ?");
    $bookingsStmt->bind_param("i", $row['user_id']);
    $bookingsStmt->execute();
    $bookingsResult = $bookingsStmt->get_result();
    if ($bookingRow = $bookingsResult->fetch_assoc()) {
        $bookingCount = $bookingRow['count'];
    }
    $bookingsStmt->close();
    
    $members[] = [
        'id' => $row['user_id'],
        'name' => $row['first_name'] . ' ' . $row['last_name'],
        'firstName' => $row['first_name'],
        'lastName' => $row['last_name'],
        'email' => $row['email_address'],
        'phone' => $row['phone_number'] ?? '',
        'role' => $row['role'],
        'joinDate' => $row['join_date'] ? date('d M Y', strtotime($row['join_date'])) : 'Not joined',
        'status' => 'Active',
        'membershipTier' => $row['membership_tier'] ?? 'No Plan',
        'bookingsCount' => $bookingCount
    ];
}

echo json_encode([
    'success' => true,
    'data' => $members
]);

$stmt->close();
$conn->close();
?>
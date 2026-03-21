<?php
// sessions.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

function sanitizeInput($data) {
    if (is_string($data)) {
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
    return $data;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Fetch future sessions, joining with class and instructor data
        $stmt = $conn->prepare("
            SELECT s.session_id, s.session_date, s.start_time, s.spots_booked, s.status AS session_status,
                   c.title, c.duration_mins, c.max_capacity, c.description,
                   u.first_name, u.last_name
            FROM sessions s
            JOIN classes c ON s.class_id = c.class_id
            LEFT JOIN users u ON c.instructor_id = u.user_id
            WHERE s.session_date >= CURDATE()
            ORDER BY s.session_date ASC, s.start_time ASC
        ");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $sessions = [];
        while ($row = $result->fetch_assoc()) {
            $row['title'] = sanitizeInput($row['title']);
            $row['description'] = sanitizeInput($row['description']);
            $row['first_name'] = sanitizeInput($row['first_name']);
            $row['last_name'] = sanitizeInput($row['last_name']);
            $row['session_status'] = sanitizeInput($row['session_status']);
            $sessions[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $sessions]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch scheduled sessions.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
?>

<?php
// classes.php
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
        // Fetch classes with their instructors
        $stmt = $conn->prepare("
            SELECT c.class_id, c.title, c.duration_mins, c.max_capacity, c.description, c.tags,
                   u.first_name, u.last_name
            FROM classes c
            LEFT JOIN users u ON c.instructor_id = u.user_id
        ");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $classes = [];
        while ($row = $result->fetch_assoc()) {
            $row['title'] = sanitizeInput($row['title']);
            $row['description'] = sanitizeInput($row['description']);
            $row['tags'] = sanitizeInput($row['tags']);
            $row['first_name'] = sanitizeInput($row['first_name']);
            $row['last_name'] = sanitizeInput($row['last_name']);
            $classes[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $classes]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch classes.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
?>

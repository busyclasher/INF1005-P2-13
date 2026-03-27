<?php
// classes.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->prepare(
            "SELECT c.class_id, c.title, c.duration_mins, c.max_capacity, c.description, c.tags, c.instructor_id,
                    u.first_name, u.last_name
             FROM classes c
             LEFT JOIN users u ON c.instructor_id = u.user_id"
        );
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
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = sanitizeInput($input['title'] ?? '');
    $duration = intval($input['duration_mins'] ?? 0);
    $max_capacity = intval($input['max_capacity'] ?? 0);
    $description = sanitizeInput($input['description'] ?? '');
    $tags = sanitizeInput($input['tags'] ?? '');
    $instructor_id = !empty($input['instructor_id']) ? intval($input['instructor_id']) : null;

    if (!$title || $duration <= 0 || $max_capacity <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'title, duration, and max_capacity are required.']);
        exit();
    }

    try {
        if ($instructor_id !== null) {
            $stmt = $conn->prepare(
                "INSERT INTO classes (title, duration_mins, max_capacity, description, tags, instructor_id)
                 VALUES (?, ?, ?, ?, ?, ?)"
            );
            $stmt->bind_param('siissi', $title, $duration, $max_capacity, $description, $tags, $instructor_id);
        } else {
            $stmt = $conn->prepare(
                "INSERT INTO classes (title, duration_mins, max_capacity, description, tags)
                 VALUES (?, ?, ?, ?, ?)"
            );
            $stmt->bind_param('siiss', $title, $duration, $max_capacity, $description, $tags);
        }

        $stmt->execute();

        $newId = $conn->insert_id;

        echo json_encode(['success' => true, 'data' => [
            'class_id' => $newId,
            'title' => $title,
            'duration_mins' => $duration,
            'max_capacity' => $max_capacity,
            'description' => $description,
            'tags' => $tags,
            'instructor_id' => $instructor_id,
        ]]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create class.', 'dbError' => $conn->error]);
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $class_id = intval($input['class_id'] ?? 0);
    if ($class_id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'class_id is required.']);
        exit();
    }

    $title = isset($input['title']) ? sanitizeInput($input['title']) : null;
    $duration = isset($input['duration_mins']) ? intval($input['duration_mins']) : null;
    $max_capacity = isset($input['max_capacity']) ? intval($input['max_capacity']) : null;
    $description = isset($input['description']) ? sanitizeInput($input['description']) : null;
    $tags = isset($input['tags']) ? sanitizeInput($input['tags']) : null;
    $instructor_id = null;
    if (array_key_exists('instructor_id', $input)) {
        if ($input['instructor_id'] === null || $input['instructor_id'] === '') {
            $instructor_id = null;
        } else {
            $instructor_id = intval($input['instructor_id']);
        }
    }

    $fields = [];
    $params = [];
    $types = '';

    if ($title !== null) { $fields[] = 'title = ?'; $params[] = $title; $types .= 's'; }
    if ($duration !== null) { $fields[] = 'duration_mins = ?'; $params[] = $duration; $types .= 'i'; }
    if ($max_capacity !== null) { $fields[] = 'max_capacity = ?'; $params[] = $max_capacity; $types .= 'i'; }
    if ($description !== null) { $fields[] = 'description = ?'; $params[] = $description; $types .= 's'; }
    if ($tags !== null) { $fields[] = 'tags = ?'; $params[] = $tags; $types .= 's'; }
    if (array_key_exists('instructor_id', $input)) {
        if ($instructor_id === null) {
            $fields[] = 'instructor_id = NULL';
        } else {
            $fields[] = 'instructor_id = ?';
            $params[] = $instructor_id;
            $types .= 'i';
        }
    }

    if (count($fields) === 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'At least one field must be provided to update.']);
        exit();
    }

    try {
        $sql = "UPDATE classes SET " . implode(', ', $fields) . " WHERE class_id = ?";
        $stmt = $conn->prepare($sql);
        $types .= 'i';
        $params[] = $class_id;

        $stmt->bind_param($types, ...$params);
        $stmt->execute();

        echo json_encode(['success' => true, 'data' => ['class_id' => $class_id]]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to update class.']);
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $class_id = intval($input['class_id'] ?? 0);
    if ($class_id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'class_id is required.']);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM classes WHERE class_id = ?");
        $stmt->bind_param('i', $class_id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Class not found.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to delete class.']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
?>

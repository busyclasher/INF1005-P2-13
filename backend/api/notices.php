<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// CORS headers for local development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

// Initialize response
$response = ['success' => false, 'data' => null, 'error' => null];

// GET: Fetch all notices or single notice by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Fetch single notice by ID
        $id = intval($_GET['id']);
        $stmt = $conn->prepare('SELECT id, title, content, author_name, created_at, is_published FROM notices WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $response['success'] = true;
            $response['data'] = $result->fetch_assoc();
        } else {
            $response['error'] = 'Notice not found';
            http_response_code(404);
        }
        $stmt->close();
    } else {
        // Fetch all notices (published only, ordered by newest first)
        $query = 'SELECT id, title, content, author_name, created_at, is_published FROM notices WHERE is_published = 1 ORDER BY created_at DESC';
        $result = $conn->query($query);
        
        if ($result) {
            $response['success'] = true;
            $response['data'] = $result->fetch_all(MYSQLI_ASSOC);
        } else {
            $response['error'] = 'Failed to fetch notices.';
            http_response_code(500);
        }
    }
}

// POST: Create new notice
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (empty($input['title']) || empty($input['content']) || empty($input['author_name'])) {
        $response['error'] = 'Title, content, and author_name are required';
        http_response_code(400);
    } else {
        // Sanitize and validate inputs
        $title = trim($input['title']);
        $content = trim($input['content']);
        $author_name = trim($input['author_name']);
        
        // Check length limits
        if (strlen($title) > 255) {
            $response['error'] = 'Title must not exceed 255 characters';
            http_response_code(400);
        } elseif (strlen($content) > 65535) {
            $response['error'] = 'Content is too long';
            http_response_code(400);
        } else {
            // Insert into database using prepared statement (prevents SQL injection)
            $stmt = $conn->prepare('INSERT INTO notices (title, content, author_name, is_published) VALUES (?, ?, ?, 1)');
            
            if (!$stmt) {
                $response['error'] = 'An unexpected error occurred.';
                http_response_code(500);
            } else {
                $stmt->bind_param('sss', $title, $content, $author_name);
                
                if ($stmt->execute()) {
                    $response['success'] = true;
                    $response['data'] = [
                        'id' => $stmt->insert_id,
                        'title' => $title,
                        'content' => $content,
                        'author_name' => $author_name,
                        'created_at' => date('Y-m-d H:i:s'),
                        'is_published' => 1
                    ];
                    http_response_code(201);
                } else {
                    $response['error'] = 'Failed to create notice.';
                    http_response_code(500);
                }
                $stmt->close();
            }
        }
    }
}

// DELETE: Delete notice by ID
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require_admin();
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id'])) {
        $response['error'] = 'ID is required';
        http_response_code(400);
    } else {
        $id = intval($input['id']);
        
        // Use prepared statement to prevent SQL injection
        $stmt = $conn->prepare('DELETE FROM notices WHERE id = ?');
        $stmt->bind_param('i', $id);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $response['success'] = true;
                $response['data'] = ['id' => $id, 'deleted' => true];
            } else {
                $response['error'] = 'Notice not found';
                http_response_code(404);
            }
        } else {
            $response['error'] = 'Failed to delete notice.';
            http_response_code(500);
        }
        $stmt->close();
    }
}

// Method not allowed
else {
    $response['error'] = 'Method not allowed';
    http_response_code(405);
}

$conn->close();
echo json_encode($response);
?>

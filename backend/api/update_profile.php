<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'User ID is required.']);
    exit();
}

if (empty($data['firstName'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'First name is required.']);
    exit();
}

if (empty($data['lastName'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Last name is required.']);
    exit();
}

$userId    = (int) $data['user_id'];
$firstName = trim($data['firstName']);
$lastName  = trim($data['lastName']);
$phone     = trim($data['phone'] ?? '');

try {
    // Verify user exists
    $checkStmt = $conn->prepare('SELECT user_id FROM users WHERE user_id = ?');
    $checkStmt->bind_param('i', $userId);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'User not found.']);
        $checkStmt->close();
        $conn->close();
        exit();
    }
    $checkStmt->close();

    $stmt = $conn->prepare('UPDATE users SET first_name = ?, last_name = ?, phone_number = ? WHERE user_id = ?');
    $stmt->bind_param('sssi', $firstName, $lastName, $phone, $userId);
    $stmt->execute();

    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully.',
        'user' => [
            'id'        => $userId,
            'firstName' => $firstName,
            'lastName'  => $lastName,
            'phone'     => $phone,
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'An unexpected error occurred.']);
} finally {
    $stmt->close();
    $conn->close();
}
?>

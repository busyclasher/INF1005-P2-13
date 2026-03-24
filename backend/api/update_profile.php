<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db   = 'assignment';
$user = 'inf1005-sqldev';
$pass = 'KkUufX74-6hM';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

// Get input data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['user_id']) || empty($data['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User ID is required']);
    exit;
}

if (!isset($data['firstName']) || empty($data['firstName'])) {
    echo json_encode(['success' => false, 'error' => 'First name is required']);
    exit;
}

if (!isset($data['lastName']) || empty($data['lastName'])) {
    echo json_encode(['success' => false, 'error' => 'Last name is required']);
    exit;
}

$userId = (int)$data['user_id'];
$firstName = trim($data['firstName']);
$lastName = trim($data['lastName']);
$phone = trim($data['phone'] ?? '');

// Check if user exists
$checkStmt = $conn->prepare("SELECT user_id FROM users WHERE user_id = ?");
$checkStmt->bind_param("i", $userId);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'User not found']);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

// Update user profile
$stmt = $conn->prepare("UPDATE users SET first_name = ?, last_name = ?, phone_number = ? WHERE user_id = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Prepare failed: ' . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("sssi", $firstName, $lastName, $phone, $userId);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully',
        'user' => [
            'id' => $userId,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'phone' => $phone
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Update failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
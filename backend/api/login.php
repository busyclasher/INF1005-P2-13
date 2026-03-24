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
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

// Get input data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || empty($data['email'])) {
    echo json_encode(['success' => false, 'error' => 'Email is required']);
    exit;
}

if (!isset($data['password']) || empty($data['password'])) {
    echo json_encode(['success' => false, 'error' => 'Password is required']);
    exit;
}

$email = $data['email'];
$password = $data['password'];

// Query the database for the user
$stmt = $conn->prepare("SELECT user_id, first_name, last_name, email_address, password_hash, role FROM users WHERE email_address = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
    $stmt->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (password_verify($password, $user['password_hash'])) {
    // Password is correct - return user data
    echo json_encode([
        'success' => true,
        'user' => [
            'user_id' => $user['user_id'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'email' => $user['email_address'],
            'role' => $user['role'],
            'phone' => $user['phone_number'] ?? '',
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
}

$stmt->close();
$conn->close();
?>
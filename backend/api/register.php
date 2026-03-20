<?php
// register.php
$host = 'localhost'; // or 127.0.0.1
$db   = 'assignment';
$user = 'inf1005-sqldev';
$pass = 'KkUufX74-6hM';


// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$firstName = $data['firstName'] ?? '';
$lastName = $data['lastName'] ?? '';
$email = $data['email'] ?? '';
$phone_number = $data['phone_number'] ?? '';
$password = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : '';
$role = "member";

$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email_address, phone_number, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'SQL prepare failed: ' . $conn->error]);
    $conn->close();
    exit;
}
$stmt->bind_param("ssssss", $firstName, $lastName, $email, $phone_number, $password, $role);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
    // Optionally call sendWelcomeEmail($email, $name);
} else {
    echo json_encode(['success' => false, 'error' => 'Registration failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
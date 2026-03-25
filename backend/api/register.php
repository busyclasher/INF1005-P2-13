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

$firstName    = trim($data['firstName'] ?? '');
$lastName     = trim($data['lastName'] ?? '');
$email        = trim($data['email'] ?? '');
$phone_number = trim($data['phone_number'] ?? '');
$password     = $data['password'] ?? '';

if (empty($firstName) || empty($lastName) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'First name, last name, email, and password are required.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address.']);
    exit();
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Password must be at least 8 characters.']);
    exit();
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$role         = 'member';

try {
    $stmt = $conn->prepare('INSERT INTO users (first_name, last_name, email_address, phone_number, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('ssssss', $firstName, $lastName, $email, $phone_number, $passwordHash, $role);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Registration successful.']);

} catch (mysqli_sql_exception $e) {
    // Duplicate email (unique constraint violation)
    if ($e->getCode() === 1062) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'An account with this email already exists.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Registration failed. Please try again.']);
    }
} finally {
    $stmt->close();
    $conn->close();
}
?>

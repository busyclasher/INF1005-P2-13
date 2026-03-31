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
require_once __DIR__ . '/send_email.php';

$data = json_decode(file_get_contents('php://input'), true);

$firstName    = trim($data['firstName'] ?? '');
$lastName     = trim($data['lastName'] ?? '');
$email        = trim($data['email'] ?? '');
$phone_number = trim($data['phone_number'] ?? '');
$password     = $data['password'] ?? '';
$membershipTier = $data['membershipTier'] ?? 'Essential';

$membershipTier = ucfirst(strtolower(trim($membershipTier)));

$planIdMap = [
    'Essential' => 1,   
    'Standard' => 2,    
    'Premium' => 3,      
];

$planId = $planIdMap[$membershipTier] ?? 1;

// Check if email exists
$checkStmt = $conn->prepare("SELECT user_id FROM users WHERE email_address = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'Email already registered']);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

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
    // Start transaction
    $conn->begin_transaction();
    
    // Insert user
    $stmt = $conn->prepare('INSERT INTO users (first_name, last_name, email_address, phone_number, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('ssssss', $firstName, $lastName, $email, $phone_number, $passwordHash, $role);
    
    if ($stmt->execute()) {
        // Get the new user's ID
        $userId = $stmt->insert_id;
        
        // ADDED: Insert membership record
        $startDate = date('Y-m-d');
        $endDate = date('Y-m-d', strtotime('+1 month')); // 1 month membership
        
        $membershipStmt = $conn->prepare('INSERT INTO memberships (user_id, plan_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)');
        $status = 'active';
        $membershipStmt->bind_param('iisss', $userId, $planId, $startDate, $endDate, $status);
        
        if (!$membershipStmt->execute()) {
            throw new Exception('Failed to create membership record');
        }
        $membershipStmt->close();
        
        // Commit transaction
        $conn->commit();
        
        // Send welcome email
        $emailResult = sendWelcomeEmail($email, $firstName, $lastName);
        
        if ($emailResult['success']) {
            echo json_encode([
                'success' => true, 
                'message' => 'Registration successful! Welcome email sent.',
                'user_id' => $userId
            ]);
        } else {
            // Registration succeeded but email failed
            echo json_encode([
                'success' => true, 
                'message' => 'Registration successful! (Welcome email could not be sent)',
                'email_error' => $emailResult['error'],
                'user_id' => $userId
            ]);
        }
    } else {
        throw new Exception('Failed to create user');
    }

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    
    if ($e->getCode() === 1062) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'An account with this email already exists.']);
    } else {
        error_log("Registration error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Registration failed. Please try again.']);
    }
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>
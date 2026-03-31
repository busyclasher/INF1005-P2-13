<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';
require_once __DIR__ . '/jwt.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email is required.']);
    exit();
}

if (empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Password is required.']);
    exit();
}

$email    = $data['email'];
$password = $data['password'];

try {
    // Query with membership information
    $stmt = $conn->prepare("
        SELECT 
            u.user_id, 
            u.first_name, 
            u.last_name, 
            u.email_address, 
            u.phone_number, 
            u.password_hash, 
            u.role,
            m.start_date,
            m.end_date,
            m.status as membership_status,
            mp.plan_name as membership_tier,
            mp.price as membership_price
        FROM users u
        LEFT JOIN memberships m ON u.user_id = m.user_id AND m.status = 'active'
        LEFT JOIN membership_plans mp ON m.plan_id = mp.plan_id
        WHERE u.email_address = ?
    ");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid email or password.']);
        exit();
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid email or password.']);
        exit();
    }

    
    $membershipTier = $user['membership_tier'] ?? 'Essential';
    $membershipTier = ucfirst(strtolower(trim($membershipTier)));

    $secret = $_ENV['JWT_SECRET'] ?? null;
    if (!$secret || !is_string($secret) || strlen($secret) < 16) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Server auth is not configured (JWT_SECRET missing).']);
        exit();
    }

    $token = jwt_encode([
        'sub' => (int)$user['user_id'],
        'role' => $user['role'],
        'email' => $user['email_address'],
        'membershipTier' => $membershipTier,
    ], $secret, 60 * 60 * 8); // 8 hours

    echo json_encode([
        'success' => true,
        'user' => [
            'user_id'        => $user['user_id'],
            'firstName'      => $user['first_name'],
            'lastName'       => $user['last_name'],
            'email'          => $user['email_address'],
            'role'           => $user['role'],
            'phone'          => $user['phone_number'] ?? '',
            'membershipTier' => $membershipTier,
            'joinDate'       => $user['start_date'] ?? null,
            'membershipEndDate' => $user['end_date'] ?? null,
            'membershipStatus'  => $user['membership_status'] ?? 'inactive'
        ],
        'token' => $token
    ]);

} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'An unexpected error occurred.']);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>
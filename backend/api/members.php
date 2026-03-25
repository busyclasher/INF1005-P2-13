<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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

// Get all members (non-admin users)
$stmt = $conn->prepare("SELECT user_id, first_name, last_name, email_address, phone_number, role, created_at FROM users WHERE role = 'member' ORDER BY created_at DESC");
$stmt->execute();
$result = $stmt->get_result();

$members = [];
while ($row = $result->fetch_assoc()) {
    $members[] = [
        'id' => $row['user_id'],
        'name' => $row['first_name'] . ' ' . $row['last_name'],
        'firstName' => $row['first_name'],
        'lastName' => $row['last_name'],
        'email' => $row['email_address'],
        'phone' => $row['phone_number'] ?? '',
        'role' => $row['role'],
        'joinDate' => date('d M Y', strtotime($row['created_at'])),
        'status' => 'Active', // You can add a status column if needed
        'membershipTier' => 'Basic', // You can fetch this from a memberships table
        'bookingsCount' => 0 // You can calculate this from bookings table
    ];
}

echo json_encode([
    'success' => true,
    'data' => $members
]);

$stmt->close();
$conn->close();
?>
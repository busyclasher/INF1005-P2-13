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

// Get all members with their membership information
// LEFT JOIN to get the earliest membership start date as the join date
$stmt = $conn->prepare("
    SELECT 
        u.user_id, 
        u.first_name, 
        u.last_name, 
        u.email_address, 
        u.phone_number, 
        u.role,
        m.start_date as join_date,
        mp.plan_name as membership_tier,
        mp.price as membership_price
    FROM users u
    LEFT JOIN memberships m ON u.user_id = m.user_id
    LEFT JOIN membership_plans mp ON m.plan_id = mp.plan_id
    WHERE u.role = 'member'
    ORDER BY m.start_date DESC
");
$stmt->execute();
$result = $stmt->get_result();

$members = [];
while ($row = $result->fetch_assoc()) {
    // Count bookings for this user
    $bookingCount = 0;
    $bookingsStmt = $conn->prepare("SELECT COUNT(*) as count FROM bookings WHERE user_id = ?");
    $bookingsStmt->bind_param("i", $row['user_id']);
    $bookingsStmt->execute();
    $bookingsResult = $bookingsStmt->get_result();
    if ($bookingRow = $bookingsResult->fetch_assoc()) {
        $bookingCount = $bookingRow['count'];
    }
    $bookingsStmt->close();
    
    $members[] = [
        'id' => $row['user_id'],
        'name' => $row['first_name'] . ' ' . $row['last_name'],
        'firstName' => $row['first_name'],
        'lastName' => $row['last_name'],
        'email' => $row['email_address'],
        'phone' => $row['phone_number'] ?? '',
        'role' => $row['role'],
        'joinDate' => $row['join_date'] ? date('d M Y', strtotime($row['join_date'])) : 'Not joined',
        'status' => 'Active', // You can add a status column if needed
        'membershipTier' => $row['membership_tier'] ?? 'No Plan',
        'bookingsCount' => $bookingCount
    ];
}

echo json_encode([
    'success' => true,
    'data' => $members
]);

$stmt->close();
$conn->close();
?>
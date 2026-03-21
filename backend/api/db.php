<?php
// db.php - Centralized Database Connection

// Avoid displaying errors directly to users in production, but keep for dev
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 to prevent leaking details, use proper JSON error handling

$host = 'localhost';
$db   = 'assignment';
$user = 'inf1005-sqldev';
$pass = 'KkUufX74-6hM';

// Enable mysqli exceptions for easier error handling in transactions
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($host, $user, $pass, $db);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $e) {
    // Return a JSON error instead of dying with HTML/text
    header("Content-Type: application/json");
    echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
    exit();
}
?>

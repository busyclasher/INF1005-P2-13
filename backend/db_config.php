<?php
// Database connection configuration

$db_host = 'localhost';
$db_username = 'inf1005-sqldev';
$db_password = 'KkUufX74-6hM';
$db_name = 'assignment';

// Create connection
$conn = new mysqli($db_host, $db_username, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Set charset to UTF-8
$conn->set_charset('utf8mb4');
?>

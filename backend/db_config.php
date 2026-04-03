<?php
// db_config.php - Centralised Database Connection

// Never expose PHP errors to the client in any environment
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/api/load_env.php';

$db_host     = $_ENV['DB_HOST'] ?? 'localhost';
$db_name     = $_ENV['DB_NAME'] ?? '';
$db_username = $_ENV['DB_USER'] ?? '';
$db_password = $_ENV['DB_PASS'] ?? '';
$db_port     = 3306;

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($db_host, $db_username, $db_password, $db_name, $db_port);
    $conn->set_charset('utf8mb4');
} catch (mysqli_sql_exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
    exit();
}
?>

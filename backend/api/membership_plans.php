<?php
// membership_plans.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// Helper function to sanitize string inputs
function sanitizeInput($data) {
    if (is_string($data)) {
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
    return $data;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->prepare("SELECT plan_id, plan_name, description, price, duration_days FROM membership_plans WHERE is_active = 1");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $plans = [];
        while ($row = $result->fetch_assoc()) {
            $row['plan_name'] = sanitizeInput($row['plan_name']);
            $row['description'] = sanitizeInput($row['description']);
            $plans[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $plans]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch membership plans.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
?>

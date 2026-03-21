<?php
// memberships.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

function sanitizeInput($data) {
    if (is_string($data)) {
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
    return $data;
}

if ($method === 'POST') {
    // CREATE: Subscribe to a new membership
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['user_id']) || !isset($input['plan_id'])) {
        echo json_encode(['success' => false, 'error' => 'user_id and plan_id are required.']);
        exit();
    }

    $userId = filter_var($input['user_id'], FILTER_VALIDATE_INT);
    $planId = filter_var($input['plan_id'], FILTER_VALIDATE_INT);

    if (!$userId || !$planId) {
        echo json_encode(['success' => false, 'error' => 'Invalid user_id or plan_id.']);
        exit();
    }

    try {
        $conn->begin_transaction();

        // Check if user already has an active membership
        $checkStmt = $conn->prepare("SELECT membership_id FROM memberships WHERE user_id = ? AND status = 'active' FOR UPDATE");
        $checkStmt->bind_param("i", $userId);
        $checkStmt->execute();
        if ($checkStmt->get_result()->num_rows > 0) {
            throw new Exception("You already have an active membership. Please update or cancel it.");
        }

        // Get plan duration to calculate end date
        $planStmt = $conn->prepare("SELECT duration_days FROM membership_plans WHERE plan_id = ? AND is_active = 1");
        $planStmt->bind_param("i", $planId);
        $planStmt->execute();
        $planRes = $planStmt->get_result();
        
        if ($planRes->num_rows === 0) {
            throw new Exception("Invalid or inactive membership plan.");
        }
        $planRow = $planRes->fetch_assoc();
        $durationDays = $planRow['duration_days'];

        // Calculate dates
        $startDate = date('Y-m-d');
        $endDate = date('Y-m-d', strtotime("+$durationDays days"));

        // Insert new membership
        $insertStmt = $conn->prepare("INSERT INTO memberships (user_id, plan_id, start_date, end_date, status) VALUES (?, ?, ?, ?, 'active')");
        $insertStmt->bind_param("iiss", $userId, $planId, $startDate, $endDate);
        $insertStmt->execute();

        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Membership activated successfully!', 'membership_id' => $insertStmt->insert_id]);

    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }

} elseif ($method === 'PUT') {
    // UPDATE: Change membership plan
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['user_id']) || !isset($input['new_plan_id'])) {
        echo json_encode(['success' => false, 'error' => 'user_id and new_plan_id are required.']);
        exit();
    }

    $userId = filter_var($input['user_id'], FILTER_VALIDATE_INT);
    $newPlanId = filter_var($input['new_plan_id'], FILTER_VALIDATE_INT);

    if (!$userId || !$newPlanId) {
        echo json_encode(['success' => false, 'error' => 'Invalid input types.']);
        exit();
    }

    try {
        $conn->begin_transaction();

        // Verify active membership exists
        $currStmt = $conn->prepare("SELECT membership_id, plan_id FROM memberships WHERE user_id = ? AND status = 'active' FOR UPDATE");
        $currStmt->bind_param("i", $userId);
        $currStmt->execute();
        $currRes = $currStmt->get_result();

        if ($currRes->num_rows === 0) {
            throw new Exception("No active membership found to update.");
        }
        $currRow = $currRes->fetch_assoc();
        
        if ($currRow['plan_id'] == $newPlanId) {
            throw new Exception("You are already on this plan.");
        }

        // Cancel old membership
        $cancelStmt = $conn->prepare("UPDATE memberships SET status = 'cancelled' WHERE membership_id = ?");
        $cancelStmt->bind_param("i", $currRow['membership_id']);
        $cancelStmt->execute();

        // Get new plan info
        $planStmt = $conn->prepare("SELECT duration_days FROM membership_plans WHERE plan_id = ? AND is_active = 1");
        $planStmt->bind_param("i", $newPlanId);
        $planStmt->execute();
        $planRes = $planStmt->get_result();
        
        if ($planRes->num_rows === 0) {
            throw new Exception("New plan is invalid or inactive.");
        }
        $durationDays = $planRes->fetch_assoc()['duration_days'];

        $startDate = date('Y-m-d');
        $endDate = date('Y-m-d', strtotime("+$durationDays days"));

        // Create new membership
        $insertStmt = $conn->prepare("INSERT INTO memberships (user_id, plan_id, start_date, end_date, status) VALUES (?, ?, ?, ?, 'active')");
        $insertStmt->bind_param("iiss", $userId, $newPlanId, $startDate, $endDate);
        $insertStmt->execute();

        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Membership plan updated successfully!']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }

} elseif ($method === 'GET') {
    // READ: Get user's active membership
    $userId = filter_input(INPUT_GET, 'user_id', FILTER_VALIDATE_INT);
    
    if (!$userId) {
        echo json_encode(['success' => false, 'error' => 'user_id is required.']);
        exit();
    }

    try {
        $stmt = $conn->prepare("
            SELECT m.membership_id, m.start_date, m.end_date, m.status, p.plan_id, p.plan_name, p.description, p.price 
            FROM memberships m
            JOIN membership_plans p ON m.plan_id = p.plan_id
            WHERE m.user_id = ? AND m.status = 'active'
            ORDER BY m.created_at DESC
            LIMIT 1
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $row['plan_name'] = sanitizeInput($row['plan_name']);
            $row['description'] = sanitizeInput($row['description']);
            echo json_encode(['success' => true, 'data' => $row]);
        } else {
            echo json_encode(['success' => true, 'data' => null]);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch membership info.']);
    }

} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
?>

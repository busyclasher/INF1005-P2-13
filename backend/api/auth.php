<?php
require_once __DIR__ . '/jwt.php';

function get_auth_bearer_token(): ?string {
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$hdr) return null;
    if (stripos($hdr, 'Bearer ') !== 0) return null;
    return trim(substr($hdr, 7));
}

function auth_get_secret(): ?string {
    // db.php / db_config.php load .env into $_ENV; use that if available
    $secret = $_ENV['JWT_SECRET'] ?? null;
    if ($secret && is_string($secret) && strlen($secret) >= 16) return $secret;
    return null;
}

function require_auth(): array {
    header('Content-Type: application/json');

    $secret = auth_get_secret();
    if (!$secret) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Server auth is not configured (JWT_SECRET missing).']);
        exit();
    }

    $token = get_auth_bearer_token();
    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Missing Authorization bearer token.']);
        exit();
    }

    $payload = jwt_decode($token, $secret);
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid or expired token.']);
        exit();
    }

    return $payload;
}

function require_admin(): array {
    $payload = require_auth();
    if (($payload['role'] ?? null) !== 'admin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Admin privileges required.']);
        exit();
    }
    return $payload;
}


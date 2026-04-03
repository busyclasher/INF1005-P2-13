<?php

require_once __DIR__ . '/load_env.php';

/**
 * Normalise origin for comparison (scheme + host + port, no trailing slash).
 */
function cors_normalise_origin(string $origin): string
{
    return rtrim(trim($origin), '/');
}

/**
 * Set Access-Control-Allow-Origin from FRONTEND_ORIGIN in backend/.env.
 *
 * - Unset or empty: allow any origin (*), for local dev only.
 * - "*": allow any origin (*).
 * - Single or comma-separated absolute origins: only matching request Origin gets reflected.
 *
 * Browsers send Origin on cross-origin XHR/fetch; omitting ACAO blocks those calls when restricted.
 */
function apply_cors_headers(): void
{
    $raw = $_ENV['FRONTEND_ORIGIN'] ?? '';
    $raw = trim($raw);
    $requestOrigin = isset($_SERVER['HTTP_ORIGIN']) ? cors_normalise_origin((string) $_SERVER['HTTP_ORIGIN']) : '';

    if ($raw === '' || $raw === '*') {
        header('Access-Control-Allow-Origin: *');
        return;
    }

    $allowed = [];
    foreach (explode(',', $raw) as $part) {
        $o = cors_normalise_origin($part);
        if ($o !== '') {
            $allowed[] = $o;
        }
    }

    if ($requestOrigin !== '' && in_array($requestOrigin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $requestOrigin);
        header('Vary: Origin');
        return;
    }

    // No matching Origin: do not send ACAO (browser will block cross-origin reads).
}

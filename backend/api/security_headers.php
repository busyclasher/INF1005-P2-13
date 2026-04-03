<?php
/**
 * Harden JSON API responses against common browser-side attacks (MIME sniffing, clickjacking, etc.).
 * Call after setting Content-Type: application/json on each HTTP endpoint.
 */
function apply_api_security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
}

/**
 * Return a client-safe error string; log full exception server-side (avoids leaking SQL/stack details).
 *
 * @param  array<int, string>  $safeMessages  Whitelist of intentional user-facing Exception messages
 */
function api_public_error_from_exception(Throwable $e, array $safeMessages, string $fallback): string
{
    error_log('API exception: ' . $e->getMessage());
    $msg = $e->getMessage();
    return in_array($msg, $safeMessages, true) ? $msg : $fallback;
}

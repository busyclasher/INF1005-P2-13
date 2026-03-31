<?php
// Minimal HS256 JWT helper (no external deps)

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_sign_hs256($headerB64, $payloadB64, $secret) {
    $sig = hash_hmac('sha256', $headerB64 . '.' . $payloadB64, $secret, true);
    return base64url_encode($sig);
}

function jwt_encode(array $payload, string $secret, int $ttlSeconds = 3600): string {
    $now = time();
    $payload['iat'] = $payload['iat'] ?? $now;
    $payload['exp'] = $payload['exp'] ?? ($now + $ttlSeconds);

    $header = ['alg' => 'HS256', 'typ' => 'JWT'];

    $headerB64 = base64url_encode(json_encode($header));
    $payloadB64 = base64url_encode(json_encode($payload));
    $sigB64 = jwt_sign_hs256($headerB64, $payloadB64, $secret);

    return $headerB64 . '.' . $payloadB64 . '.' . $sigB64;
}

function jwt_decode(string $jwt, string $secret): ?array {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) return null;
    [$headerB64, $payloadB64, $sigB64] = $parts;

    $headerJson = base64url_decode($headerB64);
    $payloadJson = base64url_decode($payloadB64);
    if ($headerJson === false || $payloadJson === false) return null;

    $header = json_decode($headerJson, true);
    $payload = json_decode($payloadJson, true);
    if (!is_array($header) || !is_array($payload)) return null;

    if (($header['alg'] ?? null) !== 'HS256') return null;

    $expected = jwt_sign_hs256($headerB64, $payloadB64, $secret);
    if (!hash_equals($expected, $sigB64)) return null;

    $now = time();
    if (isset($payload['exp']) && is_numeric($payload['exp']) && $now >= (int)$payload['exp']) {
        return null;
    }

    return $payload;
}


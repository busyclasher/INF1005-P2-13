<?php
/**
 * Default document for PHP-capable hosts (e.g. DirectoryIndex index.php).
 * Outputs the Vite-built SPA shell from index.html in the same folder.
 *
 * Deploy the contents of `dist/` after `npm run build` so index.html and /assets exist beside this file.
 */
declare(strict_types=1);

$index = __DIR__ . DIRECTORY_SEPARATOR . 'index.html';

if (!is_readable($index)) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=UTF-8');
    echo "Front-end bundle missing. From the project root run: npm run build\n";
    exit;
}

header('Content-Type: text/html; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
readfile($index);

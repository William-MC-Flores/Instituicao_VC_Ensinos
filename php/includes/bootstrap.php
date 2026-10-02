<?php

declare(strict_types=1);

$scriptDirectory = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/'));
if (basename($scriptDirectory) === 'pages') {
    $scriptDirectory = dirname($scriptDirectory);
}

define('APP_BASE_PATH', rtrim($scriptDirectory, '/'));

function app_url(string $path = ''): string
{
    $basePath = APP_BASE_PATH;
    $path = ltrim($path, '/');

    return $basePath . ($path === '' ? '/' : '/' . $path);
}

function app_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

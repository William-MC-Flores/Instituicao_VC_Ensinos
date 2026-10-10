<?php

declare(strict_types=1);

if (session_status() !== PHP_SESSION_ACTIVE) {
    ini_set('session.use_strict_mode', '1');
    $https = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== '' && strtolower((string) $_SERVER['HTTPS']) !== 'off';
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function app_config(): array
{
    static $config;
    if ($config === null) {
        $configFile = dirname(__DIR__) . '/config/config.php';
        if (!is_file($configFile)) {
            throw new RuntimeException('Crie php/config/config.php a partir de config.example.php.');
        }
        $config = require $configFile;
    }
    return $config;
}

function app_base_path(): string
{
    $script = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? '/'));
    $directory = dirname($script);
    if (preg_match('~/php/api$~', $directory)) {
        $directory = dirname(dirname($directory));
    } elseif (preg_match('~/php$~', $directory)) {
        $directory = dirname($directory);
    } elseif (basename($directory) === 'pages') {
        $directory = dirname($directory);
    }
    return rtrim($directory, '/');
}

if (!defined('APP_BASE_PATH')) {
    define('APP_BASE_PATH', app_base_path());
}

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

function app_db(): PDO
{
    static $pdo;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $database = app_config()['database'] ?? [];
    foreach (['host', 'name', 'user'] as $required) {
        if (empty($database[$required])) {
            throw new RuntimeException('Configuração incompleta do banco de dados.');
        }
    }

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $database['host'], $database['name']);
    $pdo = new PDO($dsn, $database['user'], (string) ($database['password'] ?? ''), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function app_csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function app_require_csrf(): void
{
    $provided = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if ($provided === '' || !hash_equals(app_csrf_token(), $provided)) {
        app_json_response(419, ['ok' => false, 'message' => 'Sua sessão expirou. Atualize a página e tente novamente.']);
    }
}

function app_json_response(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function app_rate_limit(string $action, string $identity, int $limit = 8): void
{
    $bucket = hash('sha256', $action . '|' . $identity);
    $pdo = app_db();
    $statement = $pdo->prepare(
        'INSERT INTO auth_rate_limits (bucket_hash, window_started_at, attempts) VALUES (?, NOW(), 1) '
        . 'ON DUPLICATE KEY UPDATE attempts = IF(window_started_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE), 1, attempts + 1), '
        . 'window_started_at = IF(window_started_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE), NOW(), window_started_at)'
    );
    $statement->execute([$bucket]);
    $statement = $pdo->prepare('SELECT attempts FROM auth_rate_limits WHERE bucket_hash = ?');
    $statement->execute([$bucket]);
    if ((int) $statement->fetchColumn() > $limit) {
        throw new DomainException('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
    }
}

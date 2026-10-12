<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

function auth_client_ip(): string
{
    // Não confiamos em X-Forwarded-For enviado pelo navegador.
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

$action = (string) ($_GET['action'] ?? $_POST['action'] ?? '');
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if ($method === 'GET' && $action === 'csrf') {
    app_json_response(200, ['ok' => true, 'csrfToken' => app_csrf_token()]);
}

if ($method === 'GET' && $action === 'me') {
    if (empty($_SESSION['user_id'])) app_json_response(200, ['ok' => true, 'authenticated' => false]);
    try {
        $statement = app_db()->prepare('SELECT name, email, role, plan FROM users WHERE id = ? LIMIT 1');
        $statement->execute([(int) $_SESSION['user_id']]);
        $user = $statement->fetch();
        if (!$user) {
            unset($_SESSION['user_id']);
            app_json_response(200, ['ok' => true, 'authenticated' => false]);
        }
        app_json_response(200, ['ok' => true, 'authenticated' => true, 'user' => [
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'plan' => $user['plan'],
        ]]);
    } catch (Throwable $error) {
        error_log('Falha ao consultar sessão: ' . $error->getMessage());
        app_json_response(500, ['ok' => false, 'message' => 'Não foi possível consultar sua sessão.']);
    }
}
if ($method !== 'POST') {
    app_json_response(405, ['ok' => false, 'message' => 'Método não permitido.']);
}
app_require_csrf();
$input = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($input)) $input = [];
$action = $action !== '' ? $action : (string) ($input['action'] ?? '');
$email = strtolower(trim((string) ($input['email'] ?? '')));
$pdo = null;

try {
    $pdo = app_db();
    switch ($action) {
        case 'register': {
            $name = trim((string) ($input['name'] ?? ''));
            $password = (string) ($input['password'] ?? '');
            app_rate_limit('register', auth_client_ip() . '|' . $email, 5);
            if ($name === '' || strlen($name) > 480 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
                app_json_response(422, ['ok' => false, 'message' => 'Informe nome e e-mail válidos.']);
            }
            if (strlen($password) < 8 || strlen($password) > 4096) {
                app_json_response(422, ['ok' => false, 'message' => 'A senha deve ter pelo menos 8 caracteres.']);
            }
            $exists = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
            $exists->execute([$email]);
            if ($exists->fetch()) {
                app_json_response(409, ['ok' => false, 'message' => 'Este e-mail já está cadastrado.']);
            }
            $insert = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
            $insert->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
            app_json_response(201, ['ok' => true, 'message' => 'Conta criada com sucesso. Faça login para continuar.']);
        }

        case 'login': {
            app_rate_limit('login', auth_client_ip() . '|' . $email, 10);
            $statement = $pdo->prepare('SELECT id, name, email, password_hash, role, plan FROM users WHERE email = ? LIMIT 1');
            $statement->execute([$email]);
            $user = $statement->fetch();
            if (!$user || !password_verify((string) ($input['password'] ?? ''), $user['password_hash'])) {
                app_json_response(401, ['ok' => false, 'message' => 'E-mail ou senha inválidos.']);
            }
            session_regenerate_id(true);
            $_SESSION['user_id'] = (int) $user['id'];
            unset($_SESSION['csrf_token']);
            app_json_response(200, ['ok' => true, 'message' => 'Login realizado.', 'user' => [
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'plan' => $user['plan'],
            ]]);
        }

        case 'logout':
            unset($_SESSION['user_id'], $_SESSION['csrf_token']);
            session_regenerate_id(true);
            app_json_response(200, ['ok' => true, 'message' => 'Sessão encerrada.']);

        case 'me': {
            if (empty($_SESSION['user_id'])) app_json_response(200, ['ok' => true, 'authenticated' => false]);
            $statement = $pdo->prepare('SELECT id, name, email, role, plan FROM users WHERE id = ? LIMIT 1');
            $statement->execute([(int) $_SESSION['user_id']]);
            $user = $statement->fetch();
            if (!$user) {
                unset($_SESSION['user_id']);
                app_json_response(200, ['ok' => true, 'authenticated' => false]);
            }
            app_json_response(200, ['ok' => true, 'authenticated' => true, 'user' => [
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'plan' => $user['plan'],
            ]]);
        }

        default:
            app_json_response(404, ['ok' => false, 'message' => 'Ação não encontrada.']);
    }
} catch (DomainException $error) {
    app_json_response(429, ['ok' => false, 'message' => $error->getMessage()]);
} catch (Throwable $error) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) $pdo->rollBack();
    error_log('Falha na autenticação: ' . $error->getMessage());
    app_json_response(500, ['ok' => false, 'message' => 'Não foi possível concluir agora. Confira a configuração do banco e tente novamente.']);
}
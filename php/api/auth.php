<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';
require_once dirname(__DIR__) . '/includes/mailer.php';

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

function auth_client_ip(): string
{
    // Não confiamos em X-Forwarded-For enviado pelo navegador.
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function auth_issue_account_token(PDO $pdo, int $userId, string $purpose, int $lifetimeSeconds): string
{
    $token = bin2hex(random_bytes(32));
    $lifetimeSeconds = max(1, min(604800, $lifetimeSeconds));
    $statement = $pdo->prepare(
        'INSERT INTO account_action_tokens (user_id, purpose, token_hash, expires_at) '
        . "VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL {$lifetimeSeconds} SECOND)) "
        . 'ON DUPLICATE KEY UPDATE token_hash = VALUES(token_hash), expires_at = VALUES(expires_at), created_at = NOW()'
    );
    $statement->execute([$userId, $purpose, hash('sha256', $token)]);
    return $token;
}

function auth_send_account_link(string $purpose, string $email, string $name, string $token): void
{
    $page = $purpose === 'email_verification' ? 'confirm-email.php' : 'reset-password.php';
    $url = rtrim((string) (app_config()['app_url'] ?? ''), '/') . '/pages/' . $page . '?token=' . rawurlencode($token);
    $safeName = app_escape($name);
    $safeUrl = app_escape($url);
    if ($purpose === 'email_verification') {
        $subject = 'Confirme seu e-mail | VC Ensinos';
        $text = "Olá, {$name}!\n\nConfirme seu endereço de e-mail acessando este link:\n{$url}\n\nO link expira em 24 horas e pode ser usado uma única vez. Se você não criou esta conta, ignore esta mensagem.";
        $action = 'Confirmar meu e-mail';
        $intro = 'Confirme que este endereço de e-mail pertence a você para ativar sua conta.';
        $expiry = 'Este link expira em 24 horas.';
    } else {
        $subject = 'Redefina sua senha | VC Ensinos';
        $text = "Olá, {$name}!\n\nPara escolher uma nova senha, acesse este link:\n{$url}\n\nO link expira em 30 minutos e pode ser usado uma única vez. Se você não solicitou a alteração, ignore esta mensagem.";
        $action = 'Redefinir minha senha';
        $intro = 'Recebemos uma solicitação para criar uma nova senha para sua conta.';
        $expiry = 'Este link expira em 30 minutos.';
    }
    $html = '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><body style="margin:0;padding:32px;background:#100e15;color:#f7f2fb;font-family:Arial,sans-serif">'
        . '<main style="max-width:560px;margin:auto;padding:32px;border:1px solid #392c47;border-radius:16px;background:#17121d">'
        . '<p style="color:#c5a0ed;font-weight:bold">VC ENSINOS</p><h1 style="font-size:24px">Olá, ' . $safeName . '!</h1>'
        . '<p style="line-height:1.6">' . app_escape($intro) . '</p><p style="margin:28px 0">'
        . '<a href="' . $safeUrl . '" style="padding:13px 18px;border-radius:9px;background:#8a55bd;color:#fff;text-decoration:none;font-weight:bold">'
        . app_escape($action) . '</a></p><p>' . app_escape($expiry) . '</p>'
        . '<p style="font-size:12px;color:#b9aec5;line-height:1.6">Se o botão não funcionar, copie este endereço para o navegador:<br>'
        . '<a href="' . $safeUrl . '" style="color:#c5a0ed;word-break:break-all">' . $safeUrl . '</a></p></main></body></html>';
    app_send_account_email($email, $name, $subject, $text, $html);
}

$action = (string) ($_GET['action'] ?? $_POST['action'] ?? '');
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if ($method === 'GET' && $action === 'csrf') {
    app_json_response(200, ['ok' => true, 'csrfToken' => app_csrf_token()]);
}

if ($method === 'GET' && $action === 'me') {
    if (empty($_SESSION['user_id'])) app_json_response(200, ['ok' => true, 'authenticated' => false]);
    try {
        $statement = app_db()->prepare('SELECT name, email, role, plan, email_verified_at FROM users WHERE id = ? LIMIT 1');
        $statement->execute([(int) $_SESSION['user_id']]);
        $user = $statement->fetch();
        if (!$user || $user['email_verified_at'] === null) {
            unset($_SESSION['user_id'], $_SESSION['csrf_token']);
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
            $pdo->beginTransaction();
            $insert = $pdo->prepare('INSERT INTO users (name, email, password_hash, email_verified_at) VALUES (?, ?, ?, NULL)');
            $insert->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
            $userId = (int) $pdo->lastInsertId();
            $token = auth_issue_account_token($pdo, $userId, 'email_verification', 86400);
            $pdo->commit();
            try {
                auth_send_account_link('email_verification', $email, $name, $token);
            } catch (Throwable $error) {
                error_log('Conta criada, mas falhou o envio do link de verificação: ' . $error->getMessage());
                app_json_response(503, [
                    'ok' => false,
                    'message' => 'Sua conta foi criada, mas não conseguimos enviar o e-mail de verificação. Confira a configuração SMTP ou tente reenviar pela tela de login.',
                ]);
            }
            app_json_response(201, ['ok' => true, 'message' => 'Conta criada. Enviamos um link de verificação para seu e-mail; confirme-o antes de entrar.']);
        }

        case 'login': {
            app_rate_limit('login', auth_client_ip() . '|' . $email, 10);
            $statement = $pdo->prepare('SELECT id, name, email, password_hash, role, plan, email_verified_at FROM users WHERE email = ? LIMIT 1');
            $statement->execute([$email]);
            $user = $statement->fetch();
            if (!$user || !password_verify((string) ($input['password'] ?? ''), $user['password_hash'])) {
                app_json_response(401, ['ok' => false, 'message' => 'E-mail ou senha inválidos.']);
            }
            if ($user['email_verified_at'] === null) {
                app_json_response(403, ['ok' => false, 'code' => 'email_not_verified', 'message' => 'Confirme seu e-mail antes de entrar. Você pode solicitar um novo link de verificação.']);
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

        case 'resend_verification': {
            app_rate_limit('resend-verification', auth_client_ip() . '|' . $email, 4);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
                app_json_response(422, ['ok' => false, 'message' => 'Informe um endereço de e-mail válido.']);
            }
            $statement = $pdo->prepare('SELECT id, name, email, email_verified_at FROM users WHERE email = ? LIMIT 1');
            $statement->execute([$email]);
            $user = $statement->fetch();
            if ($user && $user['email_verified_at'] === null) {
                $token = auth_issue_account_token($pdo, (int) $user['id'], 'email_verification', 86400);
                try {
                    auth_send_account_link('email_verification', $user['email'], $user['name'], $token);
                } catch (Throwable $error) {
                    error_log('Falha ao reenviar link de verificação: ' . $error->getMessage());
                    app_json_response(503, ['ok' => false, 'message' => 'Não foi possível enviar o e-mail agora. Tente novamente mais tarde.']);
                }
            }
            app_json_response(200, ['ok' => true, 'message' => 'Se houver uma conta pendente para esse endereço, enviaremos um novo link de verificação.']);
        }

        case 'request_password_reset': {
            app_rate_limit('password-reset', auth_client_ip() . '|' . $email, 4);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
                app_json_response(422, ['ok' => false, 'message' => 'Informe um endereço de e-mail válido.']);
            }
            $statement = $pdo->prepare('SELECT id, name, email, email_verified_at FROM users WHERE email = ? LIMIT 1');
            $statement->execute([$email]);
            $user = $statement->fetch();
            if ($user && $user['email_verified_at'] !== null) {
                $token = auth_issue_account_token($pdo, (int) $user['id'], 'password_reset', 1800);
                try {
                    auth_send_account_link('password_reset', $user['email'], $user['name'], $token);
                } catch (Throwable $error) {
                    error_log('Falha ao enviar link de redefinição de senha: ' . $error->getMessage());
                    app_json_response(503, ['ok' => false, 'message' => 'Não foi possível enviar a solicitação agora. Tente novamente mais tarde.']);
                }
            }
            app_json_response(200, ['ok' => true, 'message' => 'Se existir uma conta verificada para esse endereço, enviaremos um link para redefinir a senha.']);
        }

        case 'verify_email': {
            $token = strtolower(trim((string) ($input['token'] ?? '')));
            if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
                app_json_response(422, ['ok' => false, 'message' => 'O link de verificação é inválido ou expirou. Solicite outro pela tela de login.']);
            }
            $pdo->beginTransaction();
            $statement = $pdo->prepare(
                "SELECT id, user_id FROM account_action_tokens "
                . "WHERE token_hash = ? AND purpose = 'email_verification' AND expires_at > NOW() FOR UPDATE"
            );
            $statement->execute([hash('sha256', $token)]);
            $tokenRow = $statement->fetch();
            if (!$tokenRow) {
                $pdo->rollBack();
                app_json_response(422, ['ok' => false, 'message' => 'O link de verificação é inválido ou expirou. Solicite outro pela tela de login.']);
            }
            $statement = $pdo->prepare('UPDATE users SET email_verified_at = NOW() WHERE id = ? AND email_verified_at IS NULL');
            $statement->execute([(int) $tokenRow['user_id']]);
            if ($statement->rowCount() !== 1) {
                $pdo->rollBack();
                app_json_response(409, ['ok' => false, 'message' => 'Este endereço de e-mail já foi confirmado.']);
            }
            $statement = $pdo->prepare('DELETE FROM account_action_tokens WHERE user_id = ? AND purpose = ?');
            $statement->execute([(int) $tokenRow['user_id'], 'email_verification']);
            $pdo->commit();
            app_json_response(200, ['ok' => true, 'message' => 'E-mail confirmado. Você já pode entrar na sua conta.']);
        }

        case 'reset_password': {
            $token = strtolower(trim((string) ($input['token'] ?? '')));
            $password = (string) ($input['password'] ?? '');
            if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
                app_json_response(422, ['ok' => false, 'message' => 'O link para redefinir a senha é inválido ou expirou. Solicite outro.']);
            }
            if (strlen($password) < 8 || strlen($password) > 4096) {
                app_json_response(422, ['ok' => false, 'message' => 'A senha deve ter pelo menos 8 caracteres.']);
            }
            $pdo->beginTransaction();
            $statement = $pdo->prepare(
                "SELECT id, user_id FROM account_action_tokens "
                . "WHERE token_hash = ? AND purpose = 'password_reset' AND expires_at > NOW() FOR UPDATE"
            );
            $statement->execute([hash('sha256', $token)]);
            $tokenRow = $statement->fetch();
            if (!$tokenRow) {
                $pdo->rollBack();
                app_json_response(422, ['ok' => false, 'message' => 'O link para redefinir a senha é inválido ou expirou. Solicite outro.']);
            }
            $statement = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ? AND email_verified_at IS NOT NULL');
            $statement->execute([password_hash($password, PASSWORD_DEFAULT), (int) $tokenRow['user_id']]);
            if ($statement->rowCount() !== 1) {
                $pdo->rollBack();
                app_json_response(409, ['ok' => false, 'message' => 'Não foi possível redefinir a senha desta conta.']);
            }
            $statement = $pdo->prepare('DELETE FROM account_action_tokens WHERE user_id = ?');
            $statement->execute([(int) $tokenRow['user_id']]);
            $pdo->commit();
            app_json_response(200, ['ok' => true, 'message' => 'Senha atualizada. Você já pode entrar com a nova senha.']);
        }

        case 'me': {
            if (empty($_SESSION['user_id'])) app_json_response(200, ['ok' => true, 'authenticated' => false]);
            $statement = $pdo->prepare('SELECT id, name, email, role, plan, email_verified_at FROM users WHERE id = ? LIMIT 1');
            $statement->execute([(int) $_SESSION['user_id']]);
            $user = $statement->fetch();
            if (!$user || $user['email_verified_at'] === null) {
                unset($_SESSION['user_id'], $_SESSION['csrf_token']);
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
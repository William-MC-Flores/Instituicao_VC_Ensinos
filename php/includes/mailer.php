<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/PHPMailer-PHPMailer-36d2461/src/Exception.php';
require_once dirname(__DIR__, 2) . '/PHPMailer-PHPMailer-36d2461/src/PHPMailer.php';
require_once dirname(__DIR__, 2) . '/PHPMailer-PHPMailer-36d2461/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

function app_send_account_email(string $recipient, string $recipientName, string $subject, string $text, string $html): void
{
    $config = app_config();
    $mailConfig = $config['mail'] ?? [];
    foreach (['host', 'port', 'username', 'password', 'from_email', 'from_name'] as $required) {
        if (!isset($mailConfig[$required]) || (string) $mailConfig[$required] === '') {
            throw new RuntimeException('Configuração SMTP incompleta.');
        }
    }

    $applicationUrl = (string) ($config['app_url'] ?? '');
    $applicationParts = parse_url($applicationUrl);
    if (!is_array($applicationParts) || !in_array(strtolower((string) ($applicationParts['scheme'] ?? '')), ['http', 'https'], true)
        || empty($applicationParts['host'])) {
        throw new RuntimeException('Configure app_url com o endereço público da aplicação.');
    }

    $mailer = new PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = (string) $mailConfig['host'];
    $mailer->Port = (int) $mailConfig['port'];
    $mailer->SMTPAuth = true;
    $mailer->Username = (string) $mailConfig['username'];
    $mailer->Password = (string) $mailConfig['password'];
    $mailer->SMTPSecure = strtolower((string) ($mailConfig['encryption'] ?? 'tls')) === 'ssl'
        ? PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer::ENCRYPTION_STARTTLS;
    $mailer->Timeout = 15;
    $mailer->CharSet = PHPMailer::CHARSET_UTF8;
    $mailer->setFrom((string) $mailConfig['from_email'], (string) $mailConfig['from_name']);
    $mailer->addAddress($recipient, $recipientName);
    $mailer->isHTML(true);
    $mailer->Subject = $subject;
    $mailer->Body = $html;
    $mailer->AltBody = $text;

    try {
        $mailer->send();
    } catch (Throwable $error) {
        error_log('Falha ao enviar e-mail transacional: ' . $error->getMessage());
        throw new RuntimeException('Não foi possível enviar o e-mail agora.');
    }
}

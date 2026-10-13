<?php

declare(strict_types=1);

function app_account_email_content(
    string $purpose,
    string $name,
    string $action,
    string $intro,
    string $expiry,
    string $url
): array {
    $safeName = app_escape($name);
    $safeAction = app_escape($action);
    $safeIntro = app_escape($intro);
    $safeExpiry = app_escape($expiry);
    $safeUrl = app_escape($url);
    $heading = $purpose === 'email_verification' ? 'Confirme seu e-mail' : 'Redefina sua senha';
    $preheader = $purpose === 'email_verification'
        ? 'Só falta confirmar seu endereço para ativar sua conta VC Ensinos.'
        : 'Use o link seguro para escolher uma nova senha para sua conta.';

    $html = <<<'HTML'
<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title>{{heading}}</title></head>
<body style="margin:0;padding:0;background-color:#f2eef6;font-family:Arial,Helvetica,sans-serif;color:#241b2b;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">{{preheader}}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f2eef6" style="width:100%;background-color:#f2eef6;">
    <tr><td align="center" style="padding:32px 14px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;">
        <tr><td bgcolor="#281a35" style="padding:28px 34px;border-radius:18px 18px 0 0;background-color:#281a35;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
            <td width="48" valign="middle"><div style="width:42px;height:42px;line-height:42px;border-radius:13px;background-color:#a678d2;color:#ffffff;text-align:center;font-size:16px;font-weight:bold;">VC</div></td>
            <td valign="middle" style="padding-left:12px;color:#ffffff;font-size:15px;font-weight:bold;letter-spacing:1.5px;">VC ENSINOS<br><span style="color:#c9b6d7;font-size:11px;font-weight:normal;letter-spacing:0;">APRENDA. ENSINE. CONTRIBUA.</span></td>
            <td align="right" valign="middle" style="color:#d9c6e8;font-size:10px;font-weight:bold;letter-spacing:1px;">CONTA SEGURA</td>
          </tr></table>
        </td></tr>
        <tr><td bgcolor="#ffffff" style="padding:38px 34px 30px;background-color:#ffffff;">
          <p style="margin:0 0 10px;color:#8053a1;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">{{heading}}</p>
          <h1 style="margin:0 0 18px;color:#281a35;font-size:28px;line-height:1.25;font-weight:700;">Olá, {{name}}!</h1>
          <p style="margin:0 0 26px;color:#615767;font-size:15px;line-height:1.75;">{{intro}}</p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 27px;"><tr>
            <td align="center" bgcolor="#8053a1" style="border-radius:10px;background-color:#8053a1;">
              <a href="{{url}}" target="_blank" style="display:inline-block;padding:15px 23px;border:1px solid #8053a1;border-radius:10px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">{{action}}</a>
            </td>
          </tr></table>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f6f1fa" style="width:100%;margin:0 0 25px;border-radius:10px;background-color:#f6f1fa;">
            <tr><td style="padding:14px 16px;color:#594965;font-size:13px;line-height:1.6;">⏳ &nbsp;{{expiry}} O link pode ser usado uma única vez.</td></tr>
          </table>
          <p style="margin:0 0 8px;color:#766d7c;font-size:12px;line-height:1.6;">Se o botão não funcionar, copie e cole este endereço no navegador:</p>
          <p style="margin:0;color:#8053a1;font-size:12px;line-height:1.6;word-break:break-all;"><a href="{{url}}" target="_blank" style="color:#8053a1;text-decoration:underline;word-break:break-all;">{{url}}</a></p>
        </td></tr>
        <tr><td bgcolor="#281a35" style="padding:21px 34px;border-radius:0 0 18px 18px;background-color:#281a35;color:#c9b6d7;font-size:11px;line-height:1.7;">
          Esta mensagem foi enviada automaticamente para proteger sua conta.<br>Se você não solicitou esta ação, pode ignorar este e-mail.
          <div style="padding-top:12px;color:#a78ab9;font-weight:bold;letter-spacing:1px;">VC ENSINOS · CONHECIMENTO EM COMUNIDADE</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;

    $html = strtr($html, [
        '{{heading}}' => app_escape($heading),
        '{{preheader}}' => app_escape($preheader),
        '{{name}}' => $safeName,
        '{{intro}}' => $safeIntro,
        '{{action}}' => $safeAction,
        '{{expiry}}' => $safeExpiry,
        '{{url}}' => $safeUrl,
    ]);

    $plainText = "Olá, {$name}!\n\n{$intro}\n\n{$action}: {$url}\n\n{$expiry} O link pode ser usado uma única vez.\n\nSe você não solicitou esta ação, ignore este e-mail.";

    return ['html' => $html, 'text' => $plainText];
}

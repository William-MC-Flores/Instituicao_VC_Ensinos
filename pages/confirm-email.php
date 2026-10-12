<?php

declare(strict_types=1);

header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="no-referrer">
  <title>VC Ensinos | Confirmar e-mail</title>
  <link rel="shortcut icon" href="../img/logoPequenaBranca.png" type="image/x-icon">
  <link rel="stylesheet" href="../css/login_cadastro.css">
  <link rel="stylesheet" href="../css/design-system.css?v=20261012-email-verification">
</head>
<body>
  <main class="login account-action-page">
    <div class="container_login account-action-container">
      <section class="login_form1 auth-form">
        <div class="form_inputs account-action-form">
          <div class="escrita_form auth-form__heading">
            <span class="auth-form__eyebrow">CONFIRMAÇÃO DE E-MAIL</span>
            <h1>Ative sua conta</h1>
            <p>Confirme o endereço para concluir seu cadastro.</p>
          </div>
          <button class="auth-secondary-action" id="confirm-email-button" type="button">Confirmar meu e-mail</button>
          <div id="error-message" class="message error" role="alert" aria-live="polite"></div>
          <div id="success-message" class="message success" role="status" aria-live="polite"></div>
          <p class="auth-form__switch"><a href="login.html">Ir para o login</a></p>
        </div>
      </section>
    </div>
  </main>
  <script type="module" src="../js/cadastro/confirm-email.js"></script>
</body>
</html>

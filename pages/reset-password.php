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
  <title>VC Ensinos | Nova senha</title>
  <link rel="shortcut icon" href="../img/logoPequenaBranca.png" type="image/x-icon">
  <link rel="stylesheet" href="../css/login_cadastro.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
  <script src="../js/theme.js"></script>
  <link rel="stylesheet" href="../css/design-system.css?v=20261012-email-verification">
</head>
<body>
  <button class="theme-toggle theme-toggle--floating" type="button" data-theme-toggle aria-label="Ativar tema claro" title="Ativar tema claro">
    <i class="fa-solid fa-sun" data-theme-icon aria-hidden="true"></i>
    <span data-theme-label>Claro</span>
  </button>
  <main class="login">
    <div class="container_login">
      <section class="caixa_conteudo_login auth-visual" aria-label="Aprenda com a VC Ensinos">
        <a class="auth-visual__brand" href="../index.php" aria-label="VC Ensinos - página inicial">
          <img src="../img/logogGrandeBranca.png" alt="VC Ensinos">
          <span>Aprenda. Ensine. Contribua.</span>
        </a>
        <div class="auth-visual__body">
          <div class="auth-visual__intro">
            <span class="auth-visual__eyebrow">ACESSO SEGURO</span>
            <h2>Uma nova senha.<br>Uma nova etapa.</h2>
            <p>Crie uma senha forte e volte a aprender com a VC Ensinos.</p>
          </div>
          <div class="auth-showcase" aria-hidden="true">
            <div class="auth-showcase__top">
              <span><i class="fa-solid fa-shield-halved"></i> PROTEÇÃO DA CONTA</span>
              <span>VC ENSINOS</span>
            </div>
            <div class="auth-showcase__art">
              <div class="auth-showcase__orbit"><i class="fa-solid fa-key"></i></div>
              <div class="auth-showcase__code">
                <span><i class="fa-solid fa-lock"></i> NOVA SENHA</span>
                <strong>segurança <b>em</b><br>primeiro lugar</strong>
                <div><i></i><i></i><i></i></div>
              </div>
              <div class="auth-showcase__badge"><i class="fa-solid fa-check"></i> Link de uso único</div>
            </div>
            <div class="auth-showcase__bottom">
              <div><span>QUASE PRONTO</span><strong>Escolha uma senha com 8 ou mais caracteres</strong></div>
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>
        <div class="auth-visual__foot"><i class="fa-solid fa-heart" aria-hidden="true"></i> Conhecimento que cresce em comunidade.</div>
      </section>
      <section class="login_form1 auth-form">
        <div class="form_inputs account-action-form">
          <div class="escrita_form auth-form__heading">
            <span class="auth-form__eyebrow">RECUPERAÇÃO DE ACESSO</span>
            <h1>Defina uma nova senha</h1>
            <p>Escolha uma senha com pelo menos 8 caracteres.</p>
          </div>
          <form id="reset-password-form" class="account-action-fields">
            <label for="password">Nova senha</label>
            <input type="password" id="password" autocomplete="new-password" minlength="8" required>
            <label for="password-confirm">Confirme a nova senha</label>
            <input type="password" id="password-confirm" autocomplete="new-password" minlength="8" required>
            <button type="submit">Salvar nova senha</button>
          </form>
          <div id="error-message" class="message error" role="alert" aria-live="polite"></div>
          <div id="success-message" class="message success" role="status" aria-live="polite"></div>
          <p class="auth-form__switch"><a href="login.html">Voltar ao login</a></p>
        </div>
      </section>
    </div>
  </main>
  <script type="module" src="../js/cadastro/account-recovery.js"></script>
</body>
</html>

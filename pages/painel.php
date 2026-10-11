<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/php/includes/bootstrap.php';

if (empty($_SESSION['user_id'])) {
    header('Location: ' . app_url('pages/login.html'));
    exit;
}

try {
    $statement = app_db()->prepare('SELECT name, email FROM users WHERE id = ? LIMIT 1');
    $statement->execute([(int) $_SESSION['user_id']]);
    $user = $statement->fetch();
} catch (Throwable $error) {
    error_log('Falha ao carregar painel: ' . $error->getMessage());
    http_response_code(503);
    exit('Não foi possível carregar sua conta agora.');
}

if (!$user) {
    unset($_SESSION['user_id']);
    header('Location: ' . app_url('pages/login.html'));
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../css/painel.css">
  <link rel="stylesheet" href="../css/disciplinas.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
  <script src="../js/theme.js"></script>
  <link rel="stylesheet" href="../css/design-system.css?v=20261015">
  <link rel="shortcut icon" href="../img/logoPequenaBranca.png" type="image/x-icon">
  <title>VC Ensinos | Painel</title>
</head>
<body>
  <header>
    <div class="container_header_disciplinas">
      <div class="links_disciplinas">
        <a href="../index.php"><img src="../img/logogGrandeBranca.png" alt="VC Ensinos"></a>
        <a href="disciplinas.php"><i class="fa-solid fa-compass" aria-hidden="true"></i>Explorar</a>
        <a href="../index.php#quem_somos"><i class="fa-solid fa-circle-info" aria-hidden="true"></i>Quem somos?</a>
      </div>
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Ativar tema claro" title="Ativar tema claro">
        <i class="fa-solid fa-sun" data-theme-icon aria-hidden="true"></i>
        <span data-theme-label>Claro</span>
      </button>
      <button id="logout-button" type="button"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>Sair</button>
    </div>
  </header>
  <main class="painel">
    <div class="container_painel">
      <div class="user-panel">
        <i class="user-panel__avatar fa-solid fa-circle-user" aria-hidden="true"></i>
        <h1>Bem-vindo de volta, <span id="user-name"><?= app_escape((string) $user['name']) ?></span>!</h1>
        <p><?= app_escape((string) $user['email']) ?></p>
      </div>
    </div>
  </main>
  <script type="module" src="../js/cadastro/painel.js"></script>
</body>
</html>
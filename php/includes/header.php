<?php

$pageTitle = $pageTitle ?? 'Início';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="<?= app_escape(app_url('css/index.css')) ?>">
  <link rel="stylesheet" href="<?= app_escape(app_url('css/disciplinas.css')) ?>">
  <link rel="shortcut icon" href="<?= app_escape(app_url('img/logoPequenaBranca.png')) ?>" type="image/x-icon">
  <?php foreach (($pageStylesheets ?? []) as $stylesheet): ?>
    <link rel="stylesheet" href="<?= app_escape(app_url($stylesheet)) ?>">
  <?php endforeach; ?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
  <script src="<?= app_escape(app_url('js/theme.js')) ?>"></script>
  <link rel="stylesheet" href="<?= app_escape(app_url('css/design-system.css?v=20261012-banner-fix')) ?>">
  <title>VCensinos | <?= app_escape($pageTitle) ?></title>
</head>
<body>
  <header>
    <div class="container_header_disciplinas">
      <div class="links_disciplinas">
        <a href="<?= app_escape(app_url('index.php')) ?>"><img src="<?= app_escape(app_url('img/logogGrandeBranca.png')) ?>" alt="VC Ensinos"></a>
        <a href="<?= app_escape(app_url('pages/disciplinas.php')) ?>"><i class="fa-solid fa-compass" aria-hidden="true"></i>Explorar</a>
        <a href="<?= app_escape(app_url('index.php#planos')) ?>"><i class="fa-solid fa-layer-group" aria-hidden="true"></i>Planos</a>
        <a href="<?= app_escape(app_url('index.php#quem_somos')) ?>"><i class="fa-solid fa-circle-info" aria-hidden="true"></i>Quem Somos?</a>
        <a href="<?= app_escape(app_url('pages/creditos.php')) ?>"><i class="fa-solid fa-award" aria-hidden="true"></i>Créditos</a>
      </div>
      <?php if (!empty($showCatalogSearch)): ?>
        <div class="pesquisar">
          <div class="barra_pesquisa">
            <div class="pesquisarInput_lado"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></div>
            <input type="search" id="pesquisarInput" placeholder="Buscar cursos..." aria-label="Buscar cursos">
          </div>
        </div>
      <?php endif; ?>
      <div class="acoes_disciplinas">
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Ativar tema claro" title="Ativar tema claro">
          <i class="fa-solid fa-sun" data-theme-icon aria-hidden="true"></i>
          <span data-theme-label>Claro</span>
        </button>
        <button id="cadastre-se" style="display: none;">Cadastre-se</button>
        <button id="painelButton" style="display: none;">Painel</button>
        <button id="logout-button" style="display: none;">Sair</button>
      </div>
    </div>
  </header>

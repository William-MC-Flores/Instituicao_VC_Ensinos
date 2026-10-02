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
  <title>VCensinos | <?= app_escape($pageTitle) ?></title>
</head>
<body>
  <header>
    <div class="container_header_disciplinas">
      <div class="links_disciplinas">
        <a href="<?= app_escape(app_url('index.php')) ?>"><img src="<?= app_escape(app_url('img/logogGrandeBranca.png')) ?>" alt="VC Ensinos"></a>
        <a href="<?= app_escape(app_url('pages/disciplinas.php')) ?>">Explorar</a>
        <a href="<?= app_escape(app_url('index.php#quem_somos')) ?>">Quem Somos?</a>
        <a href="<?= app_escape(app_url('pages/creditos.php')) ?>">Créditos</a>
      </div>
      <?php if (!empty($showCatalogSearch)): ?>
        <div class="pesquisar">
          <div class="barra_pesquisa">
            <div class="pesquisarInput_lado"><img src="<?= app_escape(app_url('img/search.png')) ?>" alt=""></div>
            <input type="search" id="pesquisarInput" placeholder="Buscar cursos..." aria-label="Buscar cursos">
          </div>
        </div>
      <?php endif; ?>
      <div class="acoes_disciplinas">
        <button id="cadastre-se" style="display: none;">Cadastre-se</button>
        <button id="painelButton" style="display: none;">Painel</button>
        <button id="logout-button" style="display: none;">Sair</button>
      </div>
    </div>
  </header>

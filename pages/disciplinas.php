<?php

require_once dirname(__DIR__) . '/php/includes/bootstrap.php';
$pageTitle = 'Explorar';
$showCatalogSearch = true;
require dirname(__DIR__) . '/php/includes/header.php';
?>
<main>
  <section id="disciplinas">
    <div class="container_disciplinas">
      <div class="conteudo_disciplinas">
        <div class="escrita_disciplinas">
          <h1>CATÁLOGO</h1>
          <p>Navegue por todo o conteúdo da VC Ensinos.</p>
        </div>
        <div class="cabecario_disciplinas">
          <div class="filtro_categorias" aria-label="Filtrar cursos por categoria">
              <button type="button" data-categoria="todas" aria-pressed="true"><i class="fa-solid fa-layer-group" aria-hidden="true"></i>Todas</button>
              <button type="button" data-categoria="full-stack" aria-pressed="false"><i class="fa-solid fa-code" aria-hidden="true"></i>Full-stack</button>
              <button type="button" data-categoria="back-end" aria-pressed="false"><i class="fa-solid fa-server" aria-hidden="true"></i>Back-End</button>
              <button type="button" data-categoria="front-end" aria-pressed="false"><i class="fa-solid fa-palette" aria-hidden="true"></i>Front-End</button>
          </div>
        </div>
      </div>
      <div class="linha_grande"></div>
    </div>
  </section>

  <section class="cards_all" aria-label="Cursos disponíveis">
    <div class="cards"></div>
  </section>
</main>
<?php require dirname(__DIR__) . '/php/includes/footer.php'; ?>
<script type="module" src="<?= app_escape(app_url('js/cadastro/dashboard.js')) ?>"></script>
<script type="module" src="<?= app_escape(app_url('js/disciplinas.js')) ?>"></script>
</body>
</html>

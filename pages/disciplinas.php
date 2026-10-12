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
          <button class="catalog-filter-toggle" type="button" aria-expanded="true" aria-controls="catalog-filters" aria-label="Ocultar filtros do catálogo">
            <i class="fa-solid fa-sliders" aria-hidden="true"></i>
            <span data-filter-toggle-label>Ocultar filtros</span>
            <i class="fa-solid fa-chevron-up" data-filter-toggle-icon aria-hidden="true"></i>
          </button>
          <div class="catalog-filter-groups" id="catalog-filters">
            <div class="filtro_disciplinas" aria-label="Filtrar por disciplina">
                <button type="button" data-area="todas" aria-pressed="true"><i class="fa-solid fa-book-open" aria-hidden="true"></i>Todas</button>
                <button type="button" data-area="banco-de-dados" aria-pressed="false"><i class="fa-solid fa-database" aria-hidden="true"></i>Banco de Dados</button>
                <button type="button" data-area="java" aria-pressed="false"><i class="fa-solid fa-mug-hot" aria-hidden="true"></i>Java</button>
                <button type="button" data-area="programacao-web" aria-pressed="false"><i class="fa-solid fa-laptop-code" aria-hidden="true"></i>Programação Web</button>
                <button type="button" data-area="design-grafico" aria-pressed="false"><i class="fa-solid fa-pen-nib" aria-hidden="true"></i>Design Gráfico</button>
            </div>
            <div class="filtro_categorias" aria-label="Filtrar cursos por categoria">
                <button type="button" data-categoria="full-stack" aria-pressed="false"><i class="fa-solid fa-code" aria-hidden="true"></i>Full-stack</button>
                <button type="button" data-categoria="back-end" aria-pressed="false"><i class="fa-solid fa-server" aria-hidden="true"></i>Back-End</button>
                <button type="button" data-categoria="front-end" aria-pressed="false"><i class="fa-solid fa-palette" aria-hidden="true"></i>Front-End</button>
            </div>
          </div>
        </div>
      </div>
      <p id="catalog-discipline-status" class="catalog-discipline-status" role="status" aria-live="polite"></p>
      <div class="linha_grande"></div>
    </div>
  </section>

  <section class="cards_all" aria-label="Cursos disponíveis">
    <div class="cards"></div>
  </section>
</main>
<?php require dirname(__DIR__) . '/php/includes/footer.php'; ?>
<script type="module" src="<?= app_escape(app_url('js/cadastro/dashboard.js')) ?>"></script>
<script type="module" src="<?= app_escape(app_url('js/disciplinas.js?v=20261012-catalog-filters')) ?>"></script>
</body>
</html>

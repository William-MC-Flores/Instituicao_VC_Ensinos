<?php

require_once __DIR__ . '/php/includes/bootstrap.php';
$pageTitle = 'Início';
require __DIR__ . '/php/includes/header.php';
?>
<main>
  <div class="index">
    <div class="container_index">
      <section class="foto_index" aria-label="Apresentação">
        <div class="container_foto">
          <img src="<?= app_escape(app_url('img/index/capa.png')) ?>" alt="Banner da VC Ensinos com estudantes aprendendo tecnologia">
        </div>
      </section>

      <section class="dilema" aria-labelledby="proposta-titulo">
        <h2 id="proposta-titulo">Venha para a VC ensinos!</h2>
        <div class="container_dilema">
          <div class="caixa_dilema">
            <i class="fa-solid fa-book-open" aria-hidden="true"></i>
            <h2>Aprende</h2>
          </div>
          <div class="caixa_dilema">
            <i class="fa-solid fa-chalkboard-user" aria-hidden="true"></i>
            <h2>Ensina</h2>
          </div>
          <div class="caixa_dilema">
            <i class="fa-solid fa-people-group" aria-hidden="true"></i>
            <h2>Contribui</h2>
          </div>
        </div>
      </section>

      <section class="cursos_exibir" aria-labelledby="catalogo-titulo">
        <div class="container_exibir">
          <div class="escrita_exibir">
            <h2 id="catalogo-titulo">Já conhece nosso catálogo?</h2>
            <p>Aqui você procura seu conhecimento.</p>
            <a href="<?= app_escape(app_url('pages/disciplinas.php')) ?>"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>Ver mais...</a>
            <div class="linha"></div>
          </div>
          <div id="cards_exibir" data-catalog-url="<?= app_escape(app_url('pages/disciplinas.php')) ?>"></div>
        </div>
      </section>

      <section id="quem_somos" aria-labelledby="quem-somos-titulo">
        <div class="tit">
          <h1 id="quem-somos-titulo">Quem somos?</h1>
        </div>
        <div class="container">
          <div class="texto">
            <h2>Nossa empresa</h2>
            <p>A VC Ensinos é uma equipe acadêmica especializada em cursos profissionalizantes nas áreas de informática e tecnologia. Nosso objetivo é formar profissionais para o mercado de trabalho. Iniciamos nossas atividades em 25 de novembro de 2024, desenvolvendo atividades, videoaulas, textos e jogos educacionais para apoiar a aprendizagem. Acreditamos na educação como ferramenta para transformar vidas e construir um futuro melhor para nossos alunos e para você.</p>
          </div>
          <img id="xiru" src="<?= app_escape(app_url('img/index/ulbraIndex.jpeg')) ?>" alt="Colégio ULBRA São Lucas">
        </div>
      </section>

      <section id="contato" aria-labelledby="contato-titulo">
        <div class="tit">
          <h1 id="contato-titulo">Contate-nos</h1>
        </div>
        <div class="container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3461.638865735799!2d-51.14190792520036!3d-29.81697592076417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95196f2a593c6151%3A0xee0be7c4a3eba933!2sCol%C3%A9gio%20ULBRA%20São%20Lucas!5e0!3m2!1spt-PT!2sbr!4v1732907124383!5m2!1spt-PT!2sbr"
            width="500" height="250" style="border: 0;" allowfullscreen loading="lazy"
            title="Localização do Colégio ULBRA São Lucas"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
          <div class="texto">
            <div class="icone">
              <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
              <h3>Localização</h3>
            </div>
            <p class="resp">R. Vinte e Cinco de Julho, 564 - Vargas, Sapucaia do Sul - RS, 93222-000</p>
            <br>
            <div class="icone">
              <i class="fa-solid fa-envelope" aria-hidden="true"></i>
              <h3>Email</h3>
            </div>
            <p class="resp">vc.ensinos2025@gmail.com</p>
            <br>
            <div class="icone">
              <i class="fa-solid fa-phone" aria-hidden="true"></i>
              <h3>Telefone</h3>
            </div>
            <p class="resp">+55 (51) 3451-7557</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</main>
<?php require __DIR__ . '/php/includes/footer.php'; ?>
<script src="<?= app_escape(app_url('js/index/exibir_cards.js?v=20261018')) ?>"></script>
<script type="module" src="<?= app_escape(app_url('js/cadastro/dashboard.js')) ?>"></script>
</body>
</html>

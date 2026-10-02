<?php

require_once dirname(__DIR__) . '/php/includes/bootstrap.php';
$pageTitle = 'Créditos';
$pageStylesheets = ['css/creditos.css'];
require dirname(__DIR__) . '/php/includes/header.php';
?>
<main>
  <section class="introducao">
    <div class="container_introducao">
      <h1>Nossos créditos</h1>
      <p>Aqui está o pessoal que fez todo este site acontecer!</p>
      <div class="linha"></div>
    </div>
  </section>

  <section class="grupos" aria-label="Equipes do projeto">
    <article class="container_grupos">
      <div class="escrita_grupos">
        <h1>Equipe Banco de Dados</h1>
        <p>Bancos de dados armazenam e organizam informações de maneira estruturada, facilitando o acesso, a manipulação e a gestão dos dados.</p>
        <p><strong>Líder:</strong> Gabriel Sandes</p>
        <p><strong>Integrantes:</strong> Gabriel Bandasz, Pedro Flores, Camille Brito, Rafaela Cardoso, Gabriely Mello, Yndaia Centeno, Mayara Maciel, Flávia Silva, Vitoria Gabriela e Vitor Rosa.</p>
      </div>
      <img src="<?= app_escape(app_url('img/grupos/bandoDeDados.jpeg')) ?>" alt="Equipe de Banco de Dados">
    </article>

    <article class="container_grupos">
      <div class="escrita_grupos">
        <h1>Equipe de Computação Gráfica</h1>
        <p>A computação gráfica estuda e realiza a manipulação de dados visuais e geométricos, dando forma a animações, gráficos e imagens digitais.</p>
        <p><strong>Líder:</strong> Arthur de Brito</p>
        <p><strong>Integrantes:</strong> Anna Espolavory, Mauricio, Aldrey, Gabriel, Bernardo, Gustavo, Rafaela e Julia.</p>
      </div>
      <img src="<?= app_escape(app_url('img/grupos/computacao.jpeg')) ?>" alt="Equipe de Computação Gráfica">
    </article>

    <article class="container_grupos">
      <div class="escrita_grupos">
        <h1>Equipe de Java</h1>
        <p>Java é uma linguagem de programação usada para desenvolver sistemas e automatizar processos.</p>
        <p><strong>Líder:</strong> Arthur Vargas</p>
        <p><strong>Integrantes:</strong> Joaquim Barbosa, Leonardo Schmitt, Klint Burzlaff, Leonel Enrrique, Vitor Fernando, William Flores, Ariel Feix e Ryan Yuri Rammos.</p>
      </div>
      <img src="<?= app_escape(app_url('img/grupos/java.jpeg')) ?>" alt="Equipe de Java">
    </article>

    <article class="container_grupos">
      <div class="escrita_grupos">
        <h1>Equipe de Web</h1>
        <p>A equipe trabalhou com HTML, CSS e JavaScript para estruturar, estilizar e tornar o site interativo.</p>
        <p><strong>Líder:</strong> Vitoria</p>
        <p><strong>Integrantes:</strong> Isadora, Lucas Crippa, Nicoly, Lucas Matheus, Mateus Diolinda, Isaac Ramos, Igor, Benedeto e Antônio.</p>
      </div>
    </article>

    <article class="container_grupos">
      <div class="escrita_grupos">
        <h1>Equipe de Sistema</h1>
        <p>Responsável pela criação do site e pela experiência oferecida aos usuários.</p>
        <p><strong>Líder:</strong> Arthur Biehl</p>
        <p><strong>Integrantes:</strong> Gabriel Brandão, Vitor Harthmann, Otávio, Bruno, João Porto, Jorge e Henrique.</p>
      </div>
      <img src="<?= app_escape(app_url('img/grupos/sistema.jpeg')) ?>" alt="Equipe de Sistema">
    </article>
  </section>
</main>
<?php require dirname(__DIR__) . '/php/includes/footer.php'; ?>
</body>
</html>

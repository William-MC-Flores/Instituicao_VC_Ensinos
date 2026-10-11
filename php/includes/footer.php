  <footer>
    <div class="container_footer">
      <div class="footer_brand">
        <div class="footer_img">
          <img src="<?= app_escape(app_url('img/logogGrandeBranca.png')) ?>" alt="VC Ensinos" width="200" height="114">
        </div>
        <p>Aprenda, ensine e contribua com a comunidade de tecnologia.</p>
        <div class="redes" aria-label="Redes sociais">
          <span class="sbT">Acompanhe a VC Ensinos</span>
          <i class="fa-brands fa-instagram" role="img" aria-label="Instagram"></i>
          <i class="fa-brands fa-facebook" role="img" aria-label="Facebook"></i>
        </div>
      </div>
      <nav class="links_footer" aria-label="Institucional">
        <h2 class="sbT">Institucional</h2>
        <a href="<?= app_escape(app_url('index.php#quem_somos')) ?>">Quem somos?</a>
        <a href="<?= app_escape(app_url('pages/creditos.php')) ?>">Créditos</a>
        <a href="<?= app_escape(app_url('pages/politicas.php')) ?>">Termos de uso</a>
      </nav>
      <nav class="apoio footer_learning" aria-label="Aprenda">
        <h2 class="sbT">Aprenda</h2>
        <a href="<?= app_escape(app_url('pages/disciplinas.php')) ?>">Explorar cursos</a>
        <a href="<?= app_escape(app_url('pages/register.html')) ?>">Crie sua conta</a>
        <a href="<?= app_escape(app_url('pages/login.html')) ?>">Entrar</a>
      </nav>
      <div class="footer_contact">
        <h2 class="sbT">Fale conosco</h2>
        <a href="mailto:vc.ensinos2025@gmail.com"><i class="fa-solid fa-envelope" aria-hidden="true"></i>vc.ensinos2025@gmail.com</a>
        <a href="tel:+555134517557"><i class="fa-solid fa-phone" aria-hidden="true"></i>+55 (51) 3451-7557</a>
        <div class="footer_support">
          <span>Projeto aplicado</span>
          <img src="<?= app_escape(app_url('img/index/saoLucas.png')) ?>" alt="Colégio São Lucas">
        </div>
      </div>
    </div>
    <div class="footer_bottom">
      <div class="footer_bottom_inner">
        <p>&copy; <?= date('Y') ?> VC Ensinos. Todos os direitos reservados.</p>
        <div>
          <a href="<?= app_escape(app_url('pages/politicas.php')) ?>">Privacidade e termos</a>
          <a href="<?= app_escape(app_url('pages/creditos.php')) ?>">Créditos</a>
        </div>
      </div>
    </div>
  </footer>

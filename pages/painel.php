<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/php/includes/bootstrap.php';

if (empty($_SESSION['user_id'])) {
    header('Location: ' . app_url('pages/login.html'));
    exit;
}

try {
    $statement = app_db()->prepare('SELECT name, email, role, plan FROM users WHERE id = ? LIMIT 1');
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
  <link rel="stylesheet" href="../css/disciplinas.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
  <script src="../js/theme.js"></script>
  <link rel="stylesheet" href="../css/design-system.css?v=20261021">
  <link rel="stylesheet" href="../css/painel.css?v=20261012-profile">
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
    <div class="container_painel" id="profile-workspace" data-role="<?= app_escape((string) $user['role']) ?>">
      <section class="user-panel">
        <i class="user-panel__avatar fa-solid fa-circle-user" data-avatar-placeholder aria-hidden="true"></i>
        <img class="user-panel__avatar-image" data-profile-avatar alt="" hidden>
        <div>
          <h1>Bem-vindo, <span id="user-name"><?= app_escape((string) $user['name']) ?></span></h1>
          <p><?= app_escape((string) $user['email']) ?></p>
        </div>
        <span class="profile-role" data-role-label></span>
      </section>
      <p class="workspace-message" id="workspace-message" role="status" aria-live="polite"></p>

      <section class="workspace-section" data-profile-editor>
        <div class="profile-section-heading">
          <div><span class="profile-eyebrow">SUA IDENTIDADE</span><h2>Personalize seu perfil</h2></div>
          <a class="workspace-action workspace-action--quiet" data-profile-preview href="perfil.php?id=<?= (int) $user['id'] ?>">Visualizar perfil</a>
        </div>
        <form class="workspace-form profile-editor" data-profile-form enctype="multipart/form-data">
          <label>Nome de exibição<input name="name" maxlength="120" required></label>
          <label>Foto de perfil (JPG, PNG ou WebP; até 2 MB)
            <input name="profile_avatar" type="file" accept="image/jpeg,image/png,image/webp">
          </label>
          <label class="profile-remove-image" data-avatar-remove hidden>
            <input name="remove_avatar" type="checkbox" value="1"> Remover foto atual
          </label>

          <fieldset class="profile-advanced" data-profile-advanced disabled>
            <legend>Personalização avançada</legend>
            <p class="profile-advanced__notice" data-profile-access-note></p>
            <label>Capa (JPG, PNG ou WebP; até 3 MB)
              <input name="profile_cover" type="file" accept="image/jpeg,image/png,image/webp">
            </label>
            <label class="profile-remove-image" data-cover-remove hidden>
              <input name="remove_cover" type="checkbox" value="1"> Remover capa atual
            </label>
            <label>Biografia (até 500 caracteres)<textarea name="bio" rows="4" maxlength="500" placeholder="Conte um pouco sobre seus estudos e interesses."></textarea></label>
            <label>Pronomes (opcional)<input name="pronouns" maxlength="40" placeholder="Ex.: ela/dela"></label>
            <label>Site pessoal<input name="website_url" type="url" maxlength="255" placeholder="https://"></label>
            <label>Instagram<input name="instagram_url" type="url" maxlength="255" placeholder="https://instagram.com/"></label>
            <label>LinkedIn<input name="linkedin_url" type="url" maxlength="255" placeholder="https://linkedin.com/in/"></label>
            <label>Visibilidade do perfil
              <select name="profile_visibility">
                <option value="private">Privado — somente você pode visualizar</option>
                <option value="public">Público — qualquer pessoa com o link pode visualizar</option>
              </select>
            </label>
          </fieldset>
          <p class="profile-editor__guideline">Mantenha as informações respeitosas. Não publique conteúdo ofensivo, discriminatório ou dados pessoais de outras pessoas. Biografia e links são exibidos somente quando você torna o perfil público.</p>
          <button type="submit"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i>Salvar perfil</button>
        </form>
      </section>

      <section class="workspace-section" data-student-panel hidden>
        <div class="profile-section-heading">
          <div>
            <span class="profile-eyebrow">SUA JORNADA</span>
            <h2>Seu plano e benefícios</h2>
          </div>
          <span class="plan-badge" data-current-plan></span>
        </div>
        <div class="plan-grid">
          <article class="plan-card plan-card--active">
            <div class="plan-card__top"><span>FREE</span><i class="fa-solid fa-seedling" aria-hidden="true"></i></div>
            <h3>Grátis</h3>
            <p>A base para começar a aprender no seu ritmo.</p>
            <ul>
              <li><i class="fa-solid fa-check" aria-hidden="true"></i>Acesso ao catálogo e às disciplinas</li>
            </ul>
            <span class="plan-card__state">Plano atual</span>
          </article>
          <article class="plan-card plan-card--unavailable">
            <div class="plan-card__top"><span>STANDARD</span><i class="fa-solid fa-bolt" aria-hidden="true"></i></div>
            <h3>Mais acompanhamento</h3>
            <p>Para aprender com apoio da comunidade.</p>
            <ul>
              <li><i class="fa-solid fa-check" aria-hidden="true"></i>Todos os benefícios do Free</li>
              <li><i class="fa-solid fa-check" aria-hidden="true"></i>Personalização avançada do perfil</li>
              <li><i class="fa-solid fa-check" aria-hidden="true"></i>Inscrição em turmas abertas</li>
              <li><i class="fa-solid fa-check" aria-hidden="true"></i>Dúvidas com colaboradores</li>
              <li><i class="fa-solid fa-check" aria-hidden="true"></i>Aulas ao vivo</li>
            </ul>
            <span class="plan-card__state">Indisponível por enquanto</span>
          </article>
          <article class="plan-card plan-card--unavailable">
            <div class="plan-card__top"><span>PRO</span><i class="fa-solid fa-crown" aria-hidden="true"></i></div>
            <h3>Experiência exclusiva</h3>
            <p>Mais proximidade e conteúdos especiais.</p>
            <ul>
              <li><i class="fa-solid fa-check" aria-hidden="true"></i>Todos os benefícios do Standard</li>
              <li><i class="fa-solid fa-check" aria-hidden="true"></i>Acesso exclusivo à equipe e fundadores</li>
              <li><i class="fa-solid fa-check" aria-hidden="true"></i>Exercícios e aulas extras</li>
            </ul>
            <span class="plan-card__state">Indisponível por enquanto</span>
          </article>
        </div>
      </section>

      <section class="workspace-section" data-student-panel hidden>
        <div class="profile-section-heading">
          <div><span class="profile-eyebrow">APRENDIZADO EM GRUPO</span><h2>Turmas abertas</h2></div>
          <span class="section-caption">Entre em uma turma disponível para você</span>
        </div>
        <div class="workspace-list" data-open-classes></div>
      </section>
      <section class="workspace-section" data-student-panel hidden>
        <div class="profile-section-heading"><div><span class="profile-eyebrow">CONTEÚDO DA COMUNIDADE</span><h2>Materiais aprovados</h2></div></div>
        <div class="workspace-list" data-student-materials></div>
      </section>

      <section class="workspace-section" data-collaborator-panel hidden>
        <div class="profile-section-heading">
          <div><span class="profile-eyebrow">ESPAÇO DE ENSINO</span><h2>Suas disciplinas e turmas</h2></div>
        </div>
        <div class="workspace-list" data-collaborator-assignments></div>
      </section>
      <section class="workspace-section" data-collaborator-panel hidden>
        <div class="profile-section-heading"><div><span class="profile-eyebrow">CONTRIBUA</span><h2>Enviar conteúdo para aprovação</h2></div></div>
        <form class="workspace-form" data-content-form>
          <label>Disciplina<select name="discipline_slug" required data-collaborator-disciplines></select></label>
          <label>Turma, se aplicável<select name="class_id" data-collaborator-classes><option value="">Todas as turmas da disciplina</option></select></label>
          <label>Título<input name="title" maxlength="180" required></label>
          <label>Tipo de conteúdo<select name="content_type" required>
            <option value="article">Conteúdo / artigo</option><option value="apostille">Apostila</option>
            <option value="video">Vídeo</option><option value="exercise">Exercício</option><option value="test">Teste</option>
          </select></label>
          <label>Descrição<textarea name="description" rows="4" maxlength="10000" required></textarea></label>
          <label>Link do material (opcional)<input name="resource_url" type="url" placeholder="https://"></label>
          <button type="submit"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i>Enviar para aprovação</button>
        </form>
        <div class="workspace-list" data-collaborator-submissions></div>
      </section>

      <section class="workspace-section" data-admin-panel hidden>
        <div class="profile-section-heading"><div><span class="profile-eyebrow">ADMINISTRAÇÃO</span><h2>Contas, perfis e planos</h2></div></div>
        <div class="workspace-list" data-user-management></div>
      </section>
      <section class="workspace-section" data-admin-panel hidden>
        <div class="profile-section-heading"><div><span class="profile-eyebrow">EQUIPE PEDAGÓGICA</span><h2>Atribuir colaborador a uma disciplina</h2></div></div>
        <form class="workspace-form workspace-form--inline" data-discipline-assignment-form>
          <label>Colaborador<select name="user_id" required data-collaborator-users></select></label>
          <label>Disciplina<select name="discipline_slug" required data-all-disciplines></select></label>
          <button type="submit">Atribuir disciplina</button>
        </form>
        <div class="workspace-list" data-discipline-assignments></div>
      </section>
      <section class="workspace-section" data-admin-panel hidden>
        <div class="profile-section-heading"><div><span class="profile-eyebrow">ORGANIZAÇÃO</span><h2>Criar turma</h2></div></div>
        <form class="workspace-form workspace-form--inline" data-class-form>
          <label>Disciplina<select name="discipline_slug" required data-class-disciplines></select></label>
          <label>Nome da turma<input name="name" maxlength="160" required placeholder="Ex.: Java — turma da noite"></label>
          <label>Descrição<textarea name="description" rows="2" maxlength="2000"></textarea></label>
          <button type="submit">Criar turma aberta</button>
        </form>
        <div class="workspace-list" data-class-management></div>
      </section>
      <section class="workspace-section" data-admin-panel hidden>
        <div class="profile-section-heading"><div><span class="profile-eyebrow">CONTROLE DE QUALIDADE</span><h2>Conteúdos aguardando aprovação</h2></div></div>
        <div class="workspace-list" data-content-review></div>
      </section>
    </div>
  </main>
  <script type="module" src="../js/cadastro/painel.js?v=20261012-profile"></script>
</body>
</html>
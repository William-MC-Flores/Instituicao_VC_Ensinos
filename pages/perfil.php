<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/php/includes/bootstrap.php';

$profileId = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
if (!$profileId || $profileId < 1) {
    http_response_code(404);
    exit('Perfil não encontrado.');
}

try {
    $statement = app_db()->prepare(
        'SELECT id, name, role, plan, avatar_path, cover_path, bio, pronouns, website_url, '
        . 'instagram_url, linkedin_url, profile_visibility FROM users WHERE id = ? LIMIT 1'
    );
    $statement->execute([$profileId]);
    $profile = $statement->fetch();
} catch (Throwable $error) {
    error_log('Falha ao carregar perfil público: ' . $error->getMessage());
    http_response_code(503);
    exit('Não foi possível carregar este perfil agora.');
}

$isOwner = !empty($_SESSION['user_id']) && (int) $_SESSION['user_id'] === (int) $profileId;
if (!$profile || ($profile['profile_visibility'] !== 'public' && !$isOwner)) {
    http_response_code(404);
    exit('Perfil não encontrado.');
}

$roleNames = ['student' => 'Aluno', 'collaborator' => 'Colaborador / professor', 'admin' => 'Administrador'];
$links = [
    ['label' => 'Site', 'icon' => 'fa-solid fa-globe', 'url' => $profile['website_url']],
    ['label' => 'Instagram', 'icon' => 'fa-brands fa-instagram', 'url' => $profile['instagram_url']],
    ['label' => 'LinkedIn', 'icon' => 'fa-brands fa-linkedin', 'url' => $profile['linkedin_url']],
];
$isSafeProfilePath = fn (string $path): bool => preg_match(
    '#^php/storage/profile-images/' . (int) $profileId . '/[a-f0-9]{32}\.(jpg|png|webp)$#D',
    $path
) === 1;
$avatarPath = (string) ($profile['avatar_path'] ?? '');
$coverPath = (string) ($profile['cover_path'] ?? '');
$avatarPath = $isSafeProfilePath($avatarPath) ? $avatarPath : '';
$coverPath = $isSafeProfilePath($coverPath) ? $coverPath : '';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="<?= $profile['profile_visibility'] === 'public' ? 'index,follow' : 'noindex,nofollow' ?>">
  <link rel="stylesheet" href="../css/disciplinas.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
  <script src="../js/theme.js"></script>
  <link rel="stylesheet" href="../css/design-system.css?v=20261021">
  <link rel="stylesheet" href="../css/perfil.css?v=20261012">
  <link rel="shortcut icon" href="../img/logoPequenaBranca.png" type="image/x-icon">
  <title><?= app_escape((string) $profile['name']) ?> | Perfil VC Ensinos</title>
</head>
<body>
  <header>
    <div class="container_header_disciplinas">
      <div class="links_disciplinas">
        <a href="../index.php"><img src="../img/logogGrandeBranca.png" alt="VC Ensinos"></a>
        <a href="disciplinas.php"><i class="fa-solid fa-compass" aria-hidden="true"></i>Explorar</a>
      </div>
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Ativar tema claro" title="Ativar tema claro">
        <i class="fa-solid fa-sun" data-theme-icon aria-hidden="true"></i>
        <span data-theme-label>Claro</span>
      </button>
      <?php if ($isOwner): ?>
        <a class="profile-back-link" href="painel.php"><i class="fa-solid fa-pen" aria-hidden="true"></i>Editar perfil</a>
      <?php endif; ?>
    </div>
  </header>
  <main class="public-profile-page">
    <article class="public-profile-card">
      <?php if ($coverPath !== ''): ?>
        <img class="public-profile-cover" src="<?= app_escape(app_url('pages/perfil-imagem.php?id=' . (int) $profileId . '&tipo=capa')) ?>" alt="">
      <?php else: ?>
        <div class="public-profile-cover public-profile-cover--default" aria-hidden="true"></div>
      <?php endif; ?>
      <section class="public-profile-content">
        <div class="public-profile-identity">
          <?php if ($avatarPath !== ''): ?>
            <img class="public-profile-avatar" src="<?= app_escape(app_url('pages/perfil-imagem.php?id=' . (int) $profileId . '&tipo=avatar')) ?>" alt="Foto de <?= app_escape((string) $profile['name']) ?>">
          <?php else: ?>
            <span class="public-profile-avatar public-profile-avatar--placeholder" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
          <?php endif; ?>
          <div>
            <span class="public-profile-role"><?= app_escape($roleNames[$profile['role']] ?? 'Membro') ?></span>
            <h1><?= app_escape((string) $profile['name']) ?></h1>
            <?php if ($profile['pronouns'] !== ''): ?>
              <p class="public-profile-pronouns"><?= app_escape((string) $profile['pronouns']) ?></p>
            <?php endif; ?>
          </div>
        </div>

        <?php if ($profile['bio'] !== ''): ?>
          <p class="public-profile-bio"><?= nl2br(app_escape((string) $profile['bio'])) ?></p>
        <?php endif; ?>

        <?php $visibleLinks = array_filter($links, static function (array $link): bool {
            $url = (string) $link['url'];
            return $url !== '' && filter_var($url, FILTER_VALIDATE_URL) !== false
                && in_array(strtolower((string) parse_url($url, PHP_URL_SCHEME)), ['http', 'https'], true);
        }); ?>
        <?php if ($visibleLinks): ?>
          <nav class="public-profile-links" aria-label="Links do perfil">
            <?php foreach ($visibleLinks as $link): ?>
              <a href="<?= app_escape((string) $link['url']) ?>" target="_blank" rel="noopener noreferrer nofollow">
                <i class="<?= app_escape($link['icon']) ?>" aria-hidden="true"></i><?= app_escape($link['label']) ?>
              </a>
            <?php endforeach; ?>
          </nav>
        <?php endif; ?>
        <?php if ($isOwner && $profile['profile_visibility'] !== 'public'): ?>
          <p class="public-profile-private"><i class="fa-solid fa-lock" aria-hidden="true"></i>Este perfil está privado; somente você pode visualizá-lo.</p>
        <?php endif; ?>
      </section>
    </article>
  </main>
</body>
</html>

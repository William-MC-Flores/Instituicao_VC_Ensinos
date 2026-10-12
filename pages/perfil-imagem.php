<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/php/includes/bootstrap.php';

header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store');

$profileId = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
$imageType = (string) ($_GET['tipo'] ?? '');
if (!$profileId || $profileId < 1 || !in_array($imageType, ['avatar', 'capa'], true)) {
    http_response_code(404);
    exit;
}

try {
    $column = $imageType === 'avatar' ? 'avatar_path' : 'cover_path';
    $statement = app_db()->prepare(
        "SELECT {$column} AS image_path, profile_visibility FROM users WHERE id = ? LIMIT 1"
    );
    $statement->execute([$profileId]);
    $profile = $statement->fetch();
} catch (Throwable $error) {
    error_log('Falha ao carregar imagem do perfil: ' . $error->getMessage());
    http_response_code(503);
    exit;
}

$isOwner = !empty($_SESSION['user_id']) && (int) $_SESSION['user_id'] === (int) $profileId;
$imagePath = is_array($profile) ? (string) ($profile['image_path'] ?? '') : '';
$expectedPrefix = 'php/storage/profile-images/' . (int) $profileId . '/';
if (!$profile || ($profile['profile_visibility'] !== 'public' && !$isOwner)
    || !str_starts_with($imagePath, $expectedPrefix)
    || !preg_match('/^[a-f0-9]{32}\.(jpg|png|webp)$/', substr($imagePath, strlen($expectedPrefix)))) {
    http_response_code(404);
    exit;
}

$absolutePath = dirname(__DIR__) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $imagePath);
if (!is_file($absolutePath) || !is_readable($absolutePath)) {
    http_response_code(404);
    exit;
}
$imageInfo = @getimagesize($absolutePath);
$mime = is_array($imageInfo) ? ($imageInfo['mime'] ?? null) : null;
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!is_string($mime) || !in_array($mime, $allowedTypes, true)
    || $imageInfo[0] > 6000 || $imageInfo[1] > 6000 || $imageInfo[0] * $imageInfo[1] > 24000000) {
    http_response_code(404);
    exit;
}

header('Content-Type: ' . $mime);
$size = filesize($absolutePath);
if ($size !== false) {
    header('Content-Length: ' . $size);
}
readfile($absolutePath);

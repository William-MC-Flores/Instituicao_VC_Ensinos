<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

function workspace_current_user(PDO $pdo): array
{
    if (empty($_SESSION['user_id'])) {
        app_json_response(401, ['ok' => false, 'message' => 'Entre na sua conta para continuar.']);
    }

    $statement = $pdo->prepare(
        'SELECT id, name, email, role, plan, avatar_path, cover_path, bio, pronouns, '
        . 'website_url, instagram_url, linkedin_url, profile_visibility FROM users WHERE id = ? LIMIT 1'
    );
    $statement->execute([(int) $_SESSION['user_id']]);
    $user = $statement->fetch();
    if (!$user) {
        unset($_SESSION['user_id']);
        app_json_response(401, ['ok' => false, 'message' => 'Sua sessão expirou. Entre novamente.']);
    }

    return $user;
}

function workspace_require_role(array $user, array $roles): void
{
    if (!in_array($user['role'], $roles, true)) {
        app_json_response(403, ['ok' => false, 'message' => 'Você não tem permissão para esta ação.']);
    }
}

function workspace_text_length(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }
    $length = preg_match_all('/./us', $value, $matches);
    return $length === false ? PHP_INT_MAX : $length;
}

function workspace_can_customize_profile(array $user): bool
{
    return $user['role'] !== 'student' || in_array($user['plan'], ['standard', 'pro'], true);
}

function workspace_has_upload(string $field): bool
{
    return isset($_FILES[$field]['error']) && (int) $_FILES[$field]['error'] !== UPLOAD_ERR_NO_FILE;
}

function workspace_validate_profile_url(string $url, string $label): void
{
    if ($url === '') {
        return;
    }
    $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));
    if (workspace_text_length($url) > 255 || !filter_var($url, FILTER_VALIDATE_URL)
        || !in_array($scheme, ['http', 'https'], true)) {
        app_json_response(422, ['ok' => false, 'message' => "O link de {$label} deve ser uma URL HTTP ou HTTPS válida."]);
    }
}

function workspace_store_profile_upload(string $field, int $userId, int $maxBytes, array &$createdFiles): ?string
{
    if (!isset($_FILES[$field]) || !is_array($_FILES[$field])) {
        return null;
    }
    $file = $_FILES[$field];
    $error = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($error === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($error !== UPLOAD_ERR_OK || !isset($file['tmp_name'], $file['size'])
        || !is_uploaded_file((string) $file['tmp_name'])) {
        app_json_response(422, ['ok' => false, 'message' => 'Não foi possível receber a imagem. Tente enviá-la novamente.']);
    }
    if ((int) $file['size'] < 1 || (int) $file['size'] > $maxBytes) {
        app_json_response(422, ['ok' => false, 'message' => 'A imagem excede o tamanho máximo permitido.']);
    }

    $imageInfo = @getimagesize((string) $file['tmp_name']);
    $mime = is_array($imageInfo) ? ($imageInfo['mime'] ?? null) : null;
    $extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    if (!is_string($mime) || !isset($extensions[$mime])) {
        app_json_response(422, ['ok' => false, 'message' => 'Use uma imagem JPG, PNG ou WebP. GIF e SVG não são aceitos.']);
    }
    if ($imageInfo === false || $imageInfo[0] > 6000 || $imageInfo[1] > 6000
        || $imageInfo[0] * $imageInfo[1] > 24000000) {
        app_json_response(422, ['ok' => false, 'message' => 'A imagem é inválida ou possui dimensões muito grandes.']);
    }

    $relativeDirectory = 'php/storage/profile-images/' . $userId;
    $absoluteDirectory = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativeDirectory);
    if (!is_dir($absoluteDirectory) && !mkdir($absoluteDirectory, 0755, true) && !is_dir($absoluteDirectory)) {
        app_json_response(500, ['ok' => false, 'message' => 'Não foi possível preparar o armazenamento de imagens.']);
    }
    $filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
    $absolutePath = $absoluteDirectory . DIRECTORY_SEPARATOR . $filename;
    if (!move_uploaded_file((string) $file['tmp_name'], $absolutePath)) {
        app_json_response(500, ['ok' => false, 'message' => 'Não foi possível salvar a imagem. Tente novamente.']);
    }

    $createdFiles[] = $absolutePath;
    return $relativeDirectory . '/' . $filename;
}

function workspace_remove_profile_image(string $path, int $userId): void
{
    $prefix = 'php/storage/profile-images/' . $userId . '/';
    $filename = str_starts_with($path, $prefix) ? substr($path, strlen($prefix)) : '';
    if (!preg_match('/^[a-f0-9]{32}\.(jpg|png|webp)$/', $filename)) {
        return;
    }
    $absolutePath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $prefix . $filename);
    if (is_file($absolutePath) && !unlink($absolutePath)) {
        error_log('Não foi possível remover imagem de perfil substituída: ' . $absolutePath);
    }
}

function workspace_read_data(PDO $pdo, array $user): array
{
    $data = [
        'user' => [
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'plan' => $user['plan'],
            'avatar_path' => $user['avatar_path'],
            'cover_path' => $user['cover_path'],
            'bio' => $user['bio'],
            'pronouns' => $user['pronouns'],
            'website_url' => $user['website_url'],
            'instagram_url' => $user['instagram_url'],
            'linkedin_url' => $user['linkedin_url'],
            'profile_visibility' => $user['profile_visibility'],
        ],
        'disciplines' => [],
        'classes' => [],
        'submissions' => [],
        'users' => [],
    ];

    if ($user['role'] === 'student') {
        $canJoinClasses = in_array($user['plan'], ['standard', 'pro'], true);
        $statement = $pdo->prepare(
            "SELECT c.id, c.name, c.description, c.status, d.slug AS discipline_slug, d.name AS discipline_name,
                (e.student_id IS NOT NULL) AS enrolled,
                (SELECT COUNT(*) FROM class_enrollments ce WHERE ce.class_id = c.id) AS student_count
             FROM classes c
             JOIN disciplines d ON d.slug = c.discipline_slug
             LEFT JOIN class_enrollments e ON e.class_id = c.id AND e.student_id = ? AND ? = 1
             WHERE c.status = 'open' OR e.student_id IS NOT NULL
             ORDER BY d.name, c.name"
        );
        $statement->execute([(int) $user['id'], (int) $canJoinClasses]);
        $data['classes'] = $statement->fetchAll();
        $statement = $pdo->prepare(
            "SELECT cs.id, cs.title, cs.content_type, cs.description, cs.resource_url, "
            . 'cs.discipline_slug, d.name AS discipline_name, cs.created_at '
            . 'FROM content_submissions cs JOIN disciplines d ON d.slug = cs.discipline_slug '
            . "LEFT JOIN class_enrollments e ON e.class_id = cs.class_id AND e.student_id = ? AND ? = 1 "
            . "WHERE cs.status = 'approved' AND (cs.class_id IS NULL OR e.student_id IS NOT NULL) "
            . 'ORDER BY cs.created_at DESC LIMIT 50'
        );
        $statement->execute([(int) $user['id'], (int) $canJoinClasses]);
        $data['submissions'] = $statement->fetchAll();
    }

    if ($user['role'] === 'collaborator') {
        $statement = $pdo->prepare(
            'SELECT d.slug, d.name FROM collaborator_disciplines cd '
            . 'JOIN disciplines d ON d.slug = cd.discipline_slug '
            . 'WHERE cd.collaborator_id = ? ORDER BY d.name'
        );
        $statement->execute([(int) $user['id']]);
        $data['disciplines'] = $statement->fetchAll();

        $statement = $pdo->prepare(
            'SELECT c.id, c.name, c.discipline_slug, d.name AS discipline_name, c.status '
            . 'FROM class_collaborators cc JOIN classes c ON c.id = cc.class_id '
            . 'JOIN disciplines d ON d.slug = c.discipline_slug '
            . 'WHERE cc.collaborator_id = ? ORDER BY d.name, c.name'
        );
        $statement->execute([(int) $user['id']]);
        $data['classes'] = $statement->fetchAll();

        $statement = $pdo->prepare(
            'SELECT cs.id, cs.title, cs.content_type, cs.description, cs.resource_url, cs.status, '
            . 'cs.discipline_slug, d.name AS discipline_name, cs.created_at '
            . 'FROM content_submissions cs JOIN disciplines d ON d.slug = cs.discipline_slug '
            . 'WHERE cs.submitted_by = ? ORDER BY cs.created_at DESC LIMIT 50'
        );
        $statement->execute([(int) $user['id']]);
        $data['submissions'] = $statement->fetchAll();
    }

    if ($user['role'] === 'admin') {
        $data['disciplines'] = $pdo->query('SELECT slug, name FROM disciplines ORDER BY name')->fetchAll();
        $data['classes'] = $pdo->query(
            'SELECT c.id, c.name, c.discipline_slug, d.name AS discipline_name, c.description, c.status, '
            . '(SELECT COUNT(*) FROM class_enrollments e WHERE e.class_id = c.id) AS student_count, '
            . '(SELECT GROUP_CONCAT(u.name ORDER BY u.name SEPARATOR ", ") FROM class_collaborators cc '
            . 'JOIN users u ON u.id = cc.collaborator_id WHERE cc.class_id = c.id) AS collaborator_names '
            . 'FROM classes c JOIN disciplines d ON d.slug = c.discipline_slug ORDER BY d.name, c.name'
        )->fetchAll();
        $data['users'] = $pdo->query(
            "SELECT id, name, email, role, plan FROM users ORDER BY FIELD(role, 'admin', 'collaborator', 'student'), name"
        )->fetchAll();
        $data['disciplineAssignments'] = $pdo->query(
            'SELECT cd.collaborator_id, u.name AS collaborator_name, cd.discipline_slug, d.name AS discipline_name '
            . 'FROM collaborator_disciplines cd JOIN users u ON u.id = cd.collaborator_id '
            . 'JOIN disciplines d ON d.slug = cd.discipline_slug ORDER BY u.name, d.name'
        )->fetchAll();

        $statement = $pdo->query(
            "SELECT cs.id, cs.title, cs.content_type, cs.description, cs.resource_url, cs.status, "
            . 'cs.discipline_slug, d.name AS discipline_name, u.name AS author_name, cs.created_at '
            . 'FROM content_submissions cs JOIN disciplines d ON d.slug = cs.discipline_slug '
            . "JOIN users u ON u.id = cs.submitted_by WHERE cs.status = 'pending' ORDER BY cs.created_at"
        );
        $data['submissions'] = $statement->fetchAll();
    }

    return $data;
}

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
$action = (string) ($_GET['action'] ?? $_POST['action'] ?? '');
$pdo = null;
$createdProfileFiles = [];

try {
    $pdo = app_db();
    $user = workspace_current_user($pdo);

    if ($method === 'GET' && $action === 'data') {
        app_json_response(200, ['ok' => true, 'data' => workspace_read_data($pdo, $user)]);
    }

    if ($method !== 'POST') {
        app_json_response(405, ['ok' => false, 'message' => 'Método não permitido.']);
    }

    app_require_csrf();
    $contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
    $input = str_starts_with($contentType, 'multipart/form-data')
        ? $_POST
        : json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($input)) {
        app_json_response(400, ['ok' => false, 'message' => 'Corpo da solicitação inválido.']);
    }
    $action = $action !== '' ? $action : (string) ($input['action'] ?? '');

    switch ($action) {
        case 'profile_update': {
            $userId = (int) $user['id'];
            $name = trim((string) ($input['name'] ?? ''));
            if ($name === '' || workspace_text_length($name) > 120) {
                app_json_response(422, ['ok' => false, 'message' => 'O nome deve ter entre 1 e 120 caracteres.']);
            }

            $advancedFields = ['bio', 'pronouns', 'website_url', 'instagram_url', 'linkedin_url', 'profile_visibility'];
            $profile = [];
            foreach ($advancedFields as $field) {
                $profile[$field] = trim((string) ($input[$field] ?? $user[$field]));
            }
            if (workspace_text_length($profile['bio']) > 500 || workspace_text_length($profile['pronouns']) > 40
                || !in_array($profile['profile_visibility'], ['private', 'public'], true)) {
                app_json_response(422, ['ok' => false, 'message' => 'Revise a biografia, os pronomes e a visibilidade do perfil.']);
            }
            foreach (['website_url' => 'site', 'instagram_url' => 'Instagram', 'linkedin_url' => 'LinkedIn'] as $field => $label) {
                workspace_validate_profile_url($profile[$field], $label);
            }

            $canCustomize = workspace_can_customize_profile($user);
            if (!$canCustomize) {
                foreach ($advancedFields as $field) {
                    if ($profile[$field] !== (string) $user[$field]) {
                        app_json_response(403, ['ok' => false, 'message' => 'A personalização avançada está disponível nos planos Standard e Pro.']);
                    }
                }
                if (workspace_has_upload('profile_cover') || !empty($input['remove_cover'])) {
                    app_json_response(403, ['ok' => false, 'message' => 'A capa está disponível na personalização avançada dos planos Standard e Pro.']);
                }
            }
            if (workspace_has_upload('profile_avatar') && !empty($input['remove_avatar'])) {
                app_json_response(422, ['ok' => false, 'message' => 'Escolha entre enviar uma nova foto ou remover a atual.']);
            }
            if (workspace_has_upload('profile_cover') && !empty($input['remove_cover'])) {
                app_json_response(422, ['ok' => false, 'message' => 'Escolha entre enviar uma nova capa ou remover a atual.']);
            }

            $avatarPath = !empty($input['remove_avatar']) ? null : $user['avatar_path'];
            $coverPath = !empty($input['remove_cover']) ? null : $user['cover_path'];
            $newAvatar = workspace_store_profile_upload('profile_avatar', $userId, 2 * 1024 * 1024, $createdProfileFiles);
            $newCover = workspace_store_profile_upload('profile_cover', $userId, 3 * 1024 * 1024, $createdProfileFiles);
            if ($newAvatar !== null) {
                $avatarPath = $newAvatar;
            }
            if ($newCover !== null) {
                $coverPath = $newCover;
            }

            $statement = $pdo->prepare(
                'UPDATE users SET name = ?, avatar_path = ?, cover_path = ?, bio = ?, pronouns = ?, '
                . 'website_url = ?, instagram_url = ?, linkedin_url = ?, profile_visibility = ? WHERE id = ?'
            );
            $statement->execute([
                $name,
                $avatarPath,
                $coverPath,
                $profile['bio'],
                $profile['pronouns'],
                $profile['website_url'],
                $profile['instagram_url'],
                $profile['linkedin_url'],
                $profile['profile_visibility'],
                $userId,
            ]);

            foreach (['avatar_path' => $avatarPath, 'cover_path' => $coverPath] as $field => $newPath) {
                $oldPath = (string) ($user[$field] ?? '');
                if ($oldPath !== '' && $oldPath !== $newPath) {
                    workspace_remove_profile_image($oldPath, $userId);
                }
            }
            $createdProfileFiles = [];
            app_json_response(200, ['ok' => true, 'message' => 'Seu perfil foi atualizado.']);
        }

        case 'join_class': {
            workspace_require_role($user, ['student']);
            if (!in_array($user['plan'], ['standard', 'pro'], true)) {
                app_json_response(403, ['ok' => false, 'message' => 'A inscrição em turmas exige o plano Standard ou Pro, ainda indisponíveis.']);
            }
            $classId = filter_var($input['class_id'] ?? null, FILTER_VALIDATE_INT);
            if (!$classId || $classId < 1) {
                app_json_response(422, ['ok' => false, 'message' => 'Selecione uma turma válida.']);
            }
            $pdo->beginTransaction();
            $statement = $pdo->prepare("SELECT id FROM classes WHERE id = ? AND status = 'open' FOR UPDATE");
            $statement->execute([$classId]);
            if (!$statement->fetchColumn()) {
                $pdo->rollBack();
                app_json_response(409, ['ok' => false, 'message' => 'Esta turma não está disponível para inscrição.']);
            }
            $statement = $pdo->prepare('SELECT 1 FROM class_enrollments WHERE class_id = ? AND student_id = ?');
            $statement->execute([$classId, (int) $user['id']]);
            if ($statement->fetchColumn()) {
                $pdo->commit();
                app_json_response(200, ['ok' => true, 'message' => 'Você já está participando desta turma.']);
            }
            $statement = $pdo->prepare('INSERT INTO class_enrollments (class_id, student_id) VALUES (?, ?)');
            $statement->execute([$classId, (int) $user['id']]);
            $pdo->commit();
            app_json_response(201, ['ok' => true, 'message' => 'Inscrição confirmada para esta turma.']);
        }

        case 'admin_update_user': {
            workspace_require_role($user, ['admin']);
            $userId = filter_var($input['user_id'] ?? null, FILTER_VALIDATE_INT);
            $role = (string) ($input['role'] ?? '');
            $plan = (string) ($input['plan'] ?? '');
            if (!$userId || $userId < 1 || !in_array($role, ['student', 'collaborator', 'admin'], true)
                || !in_array($plan, ['free', 'standard', 'pro'], true)) {
                app_json_response(422, ['ok' => false, 'message' => 'Perfil, plano ou conta inválidos.']);
            }
            if ($plan !== 'free') {
                app_json_response(409, ['ok' => false, 'message' => 'Os planos Standard e Pro ainda estão indisponíveis.']);
            }

            $pdo->beginTransaction();
            $statement = $pdo->prepare('SELECT role FROM users WHERE id = ? FOR UPDATE');
            $statement->execute([$userId]);
            $target = $statement->fetch();
            if (!$target) {
                $pdo->rollBack();
                app_json_response(404, ['ok' => false, 'message' => 'Conta não encontrada.']);
            }
            if ($target['role'] === 'admin' && $role !== 'admin') {
                $adminRows = $pdo->query("SELECT id FROM users WHERE role = 'admin' FOR UPDATE")->fetchAll();
                $adminCount = count($adminRows);
                if ($adminCount <= 1) {
                    $pdo->rollBack();
                    app_json_response(409, ['ok' => false, 'message' => 'A plataforma precisa manter pelo menos um administrador.']);
                }
            }
            $statement = $pdo->prepare('UPDATE users SET role = ?, plan = ? WHERE id = ?');
            $statement->execute([$role, $role === 'student' ? $plan : 'free', $userId]);
            if ($role !== 'collaborator') {
                $statement = $pdo->prepare('DELETE FROM collaborator_disciplines WHERE collaborator_id = ?');
                $statement->execute([$userId]);
                $statement = $pdo->prepare('DELETE FROM class_collaborators WHERE collaborator_id = ?');
                $statement->execute([$userId]);
            }
            $pdo->commit();
            app_json_response(200, ['ok' => true, 'message' => 'Perfil atualizado.']);
        }

        case 'admin_assign_discipline': {
            workspace_require_role($user, ['admin']);
            $collaboratorId = filter_var($input['user_id'] ?? null, FILTER_VALIDATE_INT);
            $disciplineSlug = (string) ($input['discipline_slug'] ?? '');
            $assigned = filter_var($input['assigned'] ?? true, FILTER_VALIDATE_BOOLEAN);
            if (!$collaboratorId || $collaboratorId < 1 || $disciplineSlug === '') {
                app_json_response(422, ['ok' => false, 'message' => 'Colaborador e disciplina são obrigatórios.']);
            }
            $statement = $pdo->prepare("SELECT id FROM users WHERE id = ? AND role = 'collaborator' LIMIT 1");
            $statement->execute([$collaboratorId]);
            if (!$statement->fetchColumn()) {
                app_json_response(404, ['ok' => false, 'message' => 'Colaborador não encontrado.']);
            }
            $statement = $pdo->prepare('SELECT slug FROM disciplines WHERE slug = ? LIMIT 1');
            $statement->execute([$disciplineSlug]);
            if (!$statement->fetchColumn()) {
                app_json_response(404, ['ok' => false, 'message' => 'Disciplina não encontrada.']);
            }
            if ($assigned) {
                $statement = $pdo->prepare(
                    'INSERT IGNORE INTO collaborator_disciplines (collaborator_id, discipline_slug, assigned_by) VALUES (?, ?, ?)'
                );
                $statement->execute([$collaboratorId, $disciplineSlug, (int) $user['id']]);
            } else {
                $statement = $pdo->prepare('DELETE FROM collaborator_disciplines WHERE collaborator_id = ? AND discipline_slug = ?');
                $statement->execute([$collaboratorId, $disciplineSlug]);
                $statement = $pdo->prepare(
                    'DELETE cc FROM class_collaborators cc JOIN classes c ON c.id = cc.class_id '
                    . 'WHERE cc.collaborator_id = ? AND c.discipline_slug = ?'
                );
                $statement->execute([$collaboratorId, $disciplineSlug]);
            }
            app_json_response(200, ['ok' => true, 'message' => 'Atribuição atualizada.']);
        }

        case 'admin_create_class': {
            workspace_require_role($user, ['admin']);
            $disciplineSlug = trim((string) ($input['discipline_slug'] ?? ''));
            $name = trim((string) ($input['name'] ?? ''));
            $description = trim((string) ($input['description'] ?? ''));
            if ($disciplineSlug === '' || $name === '' || workspace_text_length($name) > 160
                || workspace_text_length($description) > 2000) {
                app_json_response(422, ['ok' => false, 'message' => 'Informe uma disciplina e um nome de turma válido.']);
            }
            $statement = $pdo->prepare('SELECT slug FROM disciplines WHERE slug = ? LIMIT 1');
            $statement->execute([$disciplineSlug]);
            if (!$statement->fetchColumn()) {
                app_json_response(404, ['ok' => false, 'message' => 'Disciplina não encontrada.']);
            }
            $statement = $pdo->prepare(
                'INSERT INTO classes (discipline_slug, name, description, created_by) VALUES (?, ?, ?, ?)'
            );
            $statement->execute([$disciplineSlug, $name, $description !== '' ? $description : null, (int) $user['id']]);
            app_json_response(201, ['ok' => true, 'message' => 'Turma criada e aberta para inscrições.']);
        }

        case 'admin_set_class_status': {
            workspace_require_role($user, ['admin']);
            $classId = filter_var($input['class_id'] ?? null, FILTER_VALIDATE_INT);
            $status = (string) ($input['status'] ?? '');
            if (!$classId || $classId < 1 || !in_array($status, ['open', 'closed'], true)) {
                app_json_response(422, ['ok' => false, 'message' => 'Turma ou situação inválida.']);
            }
            $statement = $pdo->prepare('UPDATE classes SET status = ? WHERE id = ?');
            $statement->execute([$status, $classId]);
            if ($statement->rowCount() === 0) {
                $statement = $pdo->prepare('SELECT id FROM classes WHERE id = ?');
                $statement->execute([$classId]);
                if (!$statement->fetchColumn()) {
                    app_json_response(404, ['ok' => false, 'message' => 'Turma não encontrada.']);
                }
            }
            app_json_response(200, ['ok' => true, 'message' => 'Situação da turma atualizada.']);
        }

        case 'admin_assign_class': {
            workspace_require_role($user, ['admin']);
            $classId = filter_var($input['class_id'] ?? null, FILTER_VALIDATE_INT);
            $collaboratorId = filter_var($input['user_id'] ?? null, FILTER_VALIDATE_INT);
            if (!$classId || $classId < 1 || !$collaboratorId || $collaboratorId < 1) {
                app_json_response(422, ['ok' => false, 'message' => 'Turma e colaborador são obrigatórios.']);
            }
            $pdo->beginTransaction();
            $statement = $pdo->prepare(
                "SELECT c.discipline_slug FROM classes c JOIN users u ON u.id = ? AND u.role = 'collaborator' WHERE c.id = ?"
            );
            $statement->execute([$collaboratorId, $classId]);
            $disciplineSlug = $statement->fetchColumn();
            if (!$disciplineSlug) {
                $pdo->rollBack();
                app_json_response(404, ['ok' => false, 'message' => 'Turma ou colaborador não encontrado.']);
            }
            $statement = $pdo->prepare(
                'SELECT 1 FROM collaborator_disciplines WHERE collaborator_id = ? AND discipline_slug = ?'
            );
            $statement->execute([$collaboratorId, $disciplineSlug]);
            if (!$statement->fetchColumn()) {
                $pdo->rollBack();
                app_json_response(409, ['ok' => false, 'message' => 'Atribua primeiro esta disciplina ao colaborador.']);
            }
            $statement = $pdo->prepare(
                'SELECT class_id FROM class_collaborators WHERE collaborator_id = ? AND discipline_slug = ? FOR UPDATE'
            );
            $statement->execute([$collaboratorId, $disciplineSlug]);
            $currentClassId = $statement->fetchColumn();
            if ($currentClassId && (int) $currentClassId !== $classId) {
                $pdo->rollBack();
                app_json_response(409, ['ok' => false, 'message' => 'Este colaborador já está atribuído a uma turma desta disciplina.']);
            }
            if ($currentClassId) {
                $pdo->commit();
                app_json_response(200, ['ok' => true, 'message' => 'Este colaborador já está atribuído à turma.']);
            }
            $statement = $pdo->prepare(
                'INSERT INTO class_collaborators (class_id, collaborator_id, discipline_slug, assigned_by) VALUES (?, ?, ?, ?)'
            );
            $statement->execute([$classId, $collaboratorId, $disciplineSlug, (int) $user['id']]);
            $pdo->commit();
            app_json_response(200, ['ok' => true, 'message' => 'Colaborador atribuído à turma.']);
        }

        case 'submit_content': {
            workspace_require_role($user, ['collaborator']);
            $disciplineSlug = trim((string) ($input['discipline_slug'] ?? ''));
            $classId = ($input['class_id'] ?? '') !== '' ? filter_var($input['class_id'], FILTER_VALIDATE_INT) : null;
            $title = trim((string) ($input['title'] ?? ''));
            $contentType = (string) ($input['content_type'] ?? '');
            $description = trim((string) ($input['description'] ?? ''));
            $resourceUrl = trim((string) ($input['resource_url'] ?? ''));
            if ($disciplineSlug === '' || $title === '' || workspace_text_length($title) > 180
                || $description === '' || workspace_text_length($description) > 10000
                || !in_array($contentType, ['article', 'apostille', 'video', 'exercise', 'test'], true)) {
                app_json_response(422, ['ok' => false, 'message' => 'Preencha os campos obrigatórios do conteúdo.']);
            }
            if ($resourceUrl !== '' && (!filter_var($resourceUrl, FILTER_VALIDATE_URL)
                || workspace_text_length($resourceUrl) > 2048
                || !in_array(strtolower((string) parse_url($resourceUrl, PHP_URL_SCHEME)), ['http', 'https'], true))) {
                app_json_response(422, ['ok' => false, 'message' => 'Informe um link HTTP ou HTTPS válido.']);
            }
            $statement = $pdo->prepare(
                'SELECT 1 FROM collaborator_disciplines WHERE collaborator_id = ? AND discipline_slug = ?'
            );
            $statement->execute([(int) $user['id'], $disciplineSlug]);
            if (!$statement->fetchColumn()) {
                app_json_response(403, ['ok' => false, 'message' => 'Você não está atribuído a esta disciplina.']);
            }
            if ($classId !== null) {
                if (!$classId || $classId < 1) {
                    app_json_response(422, ['ok' => false, 'message' => 'Selecione uma turma válida.']);
                }
                $statement = $pdo->prepare(
                    'SELECT 1 FROM class_collaborators cc JOIN classes c ON c.id = cc.class_id '
                    . 'WHERE cc.class_id = ? AND cc.collaborator_id = ? AND c.discipline_slug = ?'
                );
                $statement->execute([$classId, (int) $user['id'], $disciplineSlug]);
                if (!$statement->fetchColumn()) {
                    app_json_response(403, ['ok' => false, 'message' => 'Você não está atribuído a esta turma.']);
                }
            }
            $statement = $pdo->prepare(
                "INSERT INTO content_submissions "
                . "(discipline_slug, class_id, submitted_by, title, content_type, description, resource_url) "
                . "VALUES (?, ?, ?, ?, ?, ?, ?)"
            );
            $statement->execute([
                $disciplineSlug,
                $classId,
                (int) $user['id'],
                $title,
                $contentType,
                $description,
                $resourceUrl !== '' ? $resourceUrl : null,
            ]);
            app_json_response(201, ['ok' => true, 'message' => 'Conteúdo enviado para aprovação administrativa.']);
        }

        case 'review_content': {
            workspace_require_role($user, ['admin']);
            $submissionId = filter_var($input['submission_id'] ?? null, FILTER_VALIDATE_INT);
            $status = (string) ($input['status'] ?? '');
            if (!$submissionId || $submissionId < 1 || !in_array($status, ['approved', 'rejected'], true)) {
                app_json_response(422, ['ok' => false, 'message' => 'Revisão inválida.']);
            }
            $statement = $pdo->prepare(
                "UPDATE content_submissions SET status = ?, reviewed_by = ?, reviewed_at = NOW() "
                . "WHERE id = ? AND status = 'pending'"
            );
            $statement->execute([$status, (int) $user['id'], $submissionId]);
            if ($statement->rowCount() === 0) {
                app_json_response(409, ['ok' => false, 'message' => 'Este conteúdo já foi revisado ou não existe.']);
            }
            app_json_response(200, ['ok' => true, 'message' => $status === 'approved' ? 'Conteúdo aprovado.' : 'Conteúdo recusado.']);
        }

        default:
            app_json_response(404, ['ok' => false, 'message' => 'Ação não encontrada.']);
    }
} catch (Throwable $error) {
    foreach ($createdProfileFiles as $createdFile) {
        if (is_file($createdFile) && !unlink($createdFile)) {
            error_log('Não foi possível limpar upload de perfil incompleto: ' . $createdFile);
        }
    }
    if ($pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Falha no espaço de aprendizagem: ' . $error->getMessage());
    app_json_response(500, ['ok' => false, 'message' => 'Não foi possível concluir agora. Tente novamente.']);
}

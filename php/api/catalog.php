<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';

try {
    $areas = app_db()->query(
        'SELECT slug, name, description FROM subject_areas ORDER BY name'
    )->fetchAll();
    app_json_response(200, ['ok' => true, 'data' => ['subjectAreas' => $areas]]);
} catch (Throwable $error) {
    error_log('Falha ao carregar disciplinas do catálogo: ' . $error->getMessage());
    app_json_response(500, ['ok' => false, 'message' => 'Não foi possível carregar as disciplinas.']);
}

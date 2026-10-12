CREATE TABLE IF NOT EXISTS subject_areas (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(80) NOT NULL,
  name VARCHAR(160) NOT NULL,
  description VARCHAR(1000) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_subject_areas_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO subject_areas (slug, name, description) VALUES
  ('banco-de-dados', 'Banco de Dados', 'Modelagem, consultas e administração de bancos de dados.'),
  ('java', 'Java', 'Lógica de programação e desenvolvimento com Java.'),
  ('programacao-web', 'Programação Web', 'Fundamentos de desenvolvimento para a web.'),
  ('design-grafico', 'Design Gráfico', 'Ferramentas e fundamentos de criação visual.');

ALTER TABLE disciplines
  ADD COLUMN area_id BIGINT UNSIGNED NULL AFTER name,
  ADD KEY idx_disciplines_area (area_id),
  ADD CONSTRAINT fk_disciplines_area FOREIGN KEY (area_id) REFERENCES subject_areas (id);

UPDATE disciplines d
JOIN subject_areas a ON a.slug = CASE
  WHEN d.slug LIKE 'banco-dados-%' THEN 'banco-de-dados'
  WHEN d.slug LIKE 'java-%' THEN 'java'
  WHEN d.slug IN ('illustrator', 'photoshop') THEN 'design-grafico'
  WHEN d.slug = 'html-css' THEN 'programacao-web'
END
SET d.area_id = a.id;

INSERT IGNORE INTO collaborator_disciplines (collaborator_id, discipline_slug, assigned_by)
SELECT existing.collaborator_id, module.slug, existing.assigned_by
FROM collaborator_disciplines existing
JOIN disciplines original_module ON original_module.slug = existing.discipline_slug
JOIN disciplines module ON module.area_id = original_module.area_id;

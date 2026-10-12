-- No phpMyAdmin, selecione primeiro o banco criado no painel da hospedagem e importe este arquivo.

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified_at DATETIME NULL,
  role ENUM('student', 'collaborator', 'admin') NOT NULL DEFAULT 'student',
  plan ENUM('free', 'standard', 'pro') NOT NULL DEFAULT 'free',
  avatar_path VARCHAR(255) NULL,
  cover_path VARCHAR(255) NULL,
  bio VARCHAR(500) NOT NULL DEFAULT '',
  pronouns VARCHAR(40) NOT NULL DEFAULT '',
  website_url VARCHAR(255) NOT NULL DEFAULT '',
  instagram_url VARCHAR(255) NOT NULL DEFAULT '',
  linkedin_url VARCHAR(255) NOT NULL DEFAULT '',
  profile_visibility ENUM('private', 'public') NOT NULL DEFAULT 'private',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS account_action_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  purpose ENUM('email_verification', 'password_reset') NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_account_action_tokens_hash (token_hash),
  UNIQUE KEY uq_account_action_tokens_user_purpose (user_id, purpose),
  KEY idx_account_action_tokens_expiry (expires_at),
  CONSTRAINT fk_account_action_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS disciplines (
  slug VARCHAR(80) NOT NULL,
  name VARCHAR(160) NOT NULL,
  area_id BIGINT UNSIGNED NULL,
  PRIMARY KEY (slug),
  KEY idx_disciplines_area (area_id),
  CONSTRAINT fk_disciplines_area FOREIGN KEY (area_id) REFERENCES subject_areas (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO disciplines (slug, name) VALUES
  ('banco-dados-1', 'Banco de dados 1'),
  ('banco-dados-2', 'Banco de dados 2'),
  ('banco-dados-3', 'Banco de dados 3'),
  ('illustrator', 'Curso de Illustrator'),
  ('photoshop', 'Curso de Photoshop'),
  ('java-modulo-1', 'Lógica de programação - JAVA'),
  ('java-modulo-2', 'Tipos de dados - JAVA'),
  ('java-modulo-3', 'Comparação de dados - JAVA'),
  ('java-modulo-4', 'IF ELSE - JAVA'),
  ('java-modulo-6', 'Teste de mesa - JAVA'),
  ('java-modulo-7', 'Vetores - JAVA'),
  ('java-modulo-8', 'JOptionpane - JAVA'),
  ('html-css', 'Curso de HTML e CSS');

UPDATE disciplines d
JOIN subject_areas a ON a.slug = CASE
  WHEN d.slug LIKE 'banco-dados-%' THEN 'banco-de-dados'
  WHEN d.slug LIKE 'java-%' THEN 'java'
  WHEN d.slug IN ('illustrator', 'photoshop') THEN 'design-grafico'
  WHEN d.slug = 'html-css' THEN 'programacao-web'
END
SET d.area_id = a.id
WHERE d.area_id IS NULL;

CREATE TABLE IF NOT EXISTS classes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  discipline_slug VARCHAR(80) NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_classes_discipline_status (discipline_slug, status),
  CONSTRAINT fk_classes_discipline FOREIGN KEY (discipline_slug) REFERENCES disciplines (slug),
  CONSTRAINT fk_classes_creator FOREIGN KEY (created_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS collaborator_disciplines (
  collaborator_id BIGINT UNSIGNED NOT NULL,
  discipline_slug VARCHAR(80) NOT NULL,
  assigned_by BIGINT UNSIGNED NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collaborator_id, discipline_slug),
  KEY idx_collaborator_disciplines_discipline (discipline_slug),
  CONSTRAINT fk_collaborator_disciplines_user FOREIGN KEY (collaborator_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_collaborator_disciplines_discipline FOREIGN KEY (discipline_slug) REFERENCES disciplines (slug),
  CONSTRAINT fk_collaborator_disciplines_admin FOREIGN KEY (assigned_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS class_collaborators (
  class_id BIGINT UNSIGNED NOT NULL,
  collaborator_id BIGINT UNSIGNED NOT NULL,
  discipline_slug VARCHAR(80) NOT NULL,
  assigned_by BIGINT UNSIGNED NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (class_id, collaborator_id),
  UNIQUE KEY uq_collaborator_class_discipline (collaborator_id, discipline_slug),
  CONSTRAINT fk_class_collaborators_class FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE,
  CONSTRAINT fk_class_collaborators_user FOREIGN KEY (collaborator_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_class_collaborators_discipline FOREIGN KEY (discipline_slug) REFERENCES disciplines (slug),
  CONSTRAINT fk_class_collaborators_admin FOREIGN KEY (assigned_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS class_enrollments (
  class_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (class_id, student_id),
  KEY idx_class_enrollments_student (student_id),
  CONSTRAINT fk_class_enrollments_class FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE,
  CONSTRAINT fk_class_enrollments_user FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS content_submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  discipline_slug VARCHAR(80) NOT NULL,
  class_id BIGINT UNSIGNED NULL,
  submitted_by BIGINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  content_type ENUM('article', 'apostille', 'video', 'exercise', 'test') NOT NULL,
  description TEXT NOT NULL,
  resource_url VARCHAR(2048) NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  reviewed_by BIGINT UNSIGNED NULL,
  reviewed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_content_submissions_review (status, created_at),
  KEY idx_content_submissions_discipline (discipline_slug, status),
  CONSTRAINT fk_content_submissions_discipline FOREIGN KEY (discipline_slug) REFERENCES disciplines (slug),
  CONSTRAINT fk_content_submissions_class FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE SET NULL,
  CONSTRAINT fk_content_submissions_author FOREIGN KEY (submitted_by) REFERENCES users (id),
  CONSTRAINT fk_content_submissions_reviewer FOREIGN KEY (reviewed_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  bucket_hash CHAR(64) NOT NULL,
  window_started_at DATETIME NOT NULL,
  attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket_hash),
  KEY idx_auth_rate_limits_window (window_started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE users
  ADD COLUMN email_verified_at DATETIME NULL AFTER password_hash;

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

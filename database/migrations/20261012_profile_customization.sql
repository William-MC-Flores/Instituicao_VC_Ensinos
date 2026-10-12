ALTER TABLE users
  ADD COLUMN avatar_path VARCHAR(255) NULL AFTER plan,
  ADD COLUMN cover_path VARCHAR(255) NULL AFTER avatar_path,
  ADD COLUMN bio VARCHAR(500) NOT NULL DEFAULT '' AFTER cover_path,
  ADD COLUMN pronouns VARCHAR(40) NOT NULL DEFAULT '' AFTER bio,
  ADD COLUMN website_url VARCHAR(255) NOT NULL DEFAULT '' AFTER pronouns,
  ADD COLUMN instagram_url VARCHAR(255) NOT NULL DEFAULT '' AFTER website_url,
  ADD COLUMN linkedin_url VARCHAR(255) NOT NULL DEFAULT '' AFTER instagram_url,
  ADD COLUMN profile_visibility ENUM('private', 'public') NOT NULL DEFAULT 'private' AFTER linkedin_url;

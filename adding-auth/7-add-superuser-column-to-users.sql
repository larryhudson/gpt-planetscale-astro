-- add superuser column to users table. should be a boolean.
ALTER TABLE users ADD COLUMN superuser BOOLEAN DEFAULT 0;

-- update user with ID 1 to be a superuser
UPDATE users SET superuser = 1 WHERE id = 1;

-- set approved_at column to now, for user with ID 1
UPDATE users SET approved_at = DATETIME('now') WHERE id = 1;
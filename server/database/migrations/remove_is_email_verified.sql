-- Migration: remove is_email_verified column from users table (if present)
ALTER TABLE users
  DROP COLUMN IF EXISTS is_email_verified;

-- Note: Run this against the database to remove the column:
-- mysql -u root -p accounts_db < remove_is_email_verified.sql

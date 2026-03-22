-- Migration: add email verification & approval fields to users table
ALTER TABLE users
  ADD COLUMN email VARCHAR(255) UNIQUE AFTER username,
  ADD COLUMN verification_token VARCHAR(255) NULL AFTER status,
  ADD COLUMN verification_expires DATETIME NULL AFTER verification_token,
  ADD COLUMN approval_status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending' AFTER verification_expires;

-- Note: run this migration against your database (mysql CLI or Workbench)
-- Example (Linux/macOS):
-- mysql -u root -p accounts_db < add_user_verification_approval.sql

-- After running the migration, update existing admin user's email if desired.
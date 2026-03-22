-- Migration: add password reset fields to users table
ALTER TABLE users
  ADD COLUMN password_reset_token VARCHAR(255) NULL AFTER verification_expires,
  ADD COLUMN password_reset_expires DATETIME NULL AFTER password_reset_token;

-- Run: mysql -u root -p accounts_db < add_password_reset_fields.sql
-- BME/server/database/schema.sql
-- Complete Database Schema for Accounts Management System

-- Create Database
CREATE DATABASE IF NOT EXISTS accounts_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE accounts_db;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Owner', 'Manager', 'Cashier', 'User-Admin', 'User') NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    verification_token VARCHAR(255),
    verification_expires DATETIME,
    approval_status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    permissions JSON NOT NULL,
    edit_access JSON NOT NULL,
    delete_access JSON NOT NULL,
    created_date DATE NOT NULL,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================
-- STAFF TABLE
-- ============================================
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    designation VARCHAR(100) NOT NULL,
    mobile_no VARCHAR(15),
    introducer VARCHAR(100),
    introducer_id VARCHAR(20),
    status ENUM('Active', 'Resigned') DEFAULT 'Active',
    
    -- Employment History (8 periods)
    joining_date DATE NOT NULL,
    resigned_date DATE,
    joining_date_2 DATE,
    resigned_date_2 DATE,
    joining_date_3 DATE,
    resigned_date_3 DATE,
    joining_date_4 DATE,
    resigned_date_4 DATE,
    joining_date_5 DATE,
    resigned_date_5 DATE,
    joining_date_6 DATE,
    resigned_date_6 DATE,
    joining_date_7 DATE,
    resigned_date_7 DATE,
    joining_date_8 DATE,
    resigned_date_8 DATE,
    
    -- Address (JSON format)
    address JSON NOT NULL,
    
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_staff_id (staff_id),
    INDEX idx_status (status),
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- ============================================
-- ENTRIES TABLE (Daily Financial Entries)
-- ============================================
CREATE TABLE entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    cash DECIMAL(10,2) DEFAULT 0,
    bank DECIMAL(10,2) DEFAULT 0,
    sales DECIMAL(10,2) DEFAULT 0,
    
    -- Expenses
    mutton DECIMAL(10,2) DEFAULT 0,
    chicken DECIMAL(10,2) DEFAULT 0,
    grocery DECIMAL(10,2) DEFAULT 0,
    flower DECIMAL(10,2) DEFAULT 0,
    leaf DECIMAL(10,2) DEFAULT 0,
    gas DECIMAL(10,2) DEFAULT 0,
    misc DECIMAL(10,2) DEFAULT 0,
    pigmy_s DECIMAL(10,2) DEFAULT 0,
    salary DECIMAL(10,2) DEFAULT 0,
    
    -- Calculated fields
    expenses DECIMAL(10,2) GENERATED ALWAYS AS 
        (mutton + chicken + grocery + flower + leaf + gas + misc + pigmy_s + salary) STORED,
    profit DECIMAL(10,2) GENERATED ALWAYS AS (sales - expenses) STORED,
    
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_date (date),
    INDEX idx_date (date),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB;

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    staff_id VARCHAR(20) NOT NULL,
    staff_name VARCHAR(100) NOT NULL,
    status ENUM('Present', 'Absent', 'Morning Half', 'Afternoon Half', 'Day Off') NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    reason ENUM('Medical Leave', 'Function', 'Others'),
    reason_details VARCHAR(255),
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_staff_date (staff_id, date),
    INDEX idx_date (date),
    INDEX idx_staff_id (staff_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- SALARY TABLE
-- ============================================
CREATE TABLE salaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    staff_id VARCHAR(20) NOT NULL,
    staff_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    payment_mode ENUM('Cash', 'UPI', 'NEFT', 'Cheque') NOT NULL,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_date (date),
    INDEX idx_staff_id (staff_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- CREDITORS TABLE
-- ============================================
CREATE TABLE creditors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_date DATE NOT NULL,
    settled_date DATE,
    entity_name VARCHAR(100) NOT NULL,
    particulars VARCHAR(255) NOT NULL,
    bill_amount DECIMAL(10,2) NOT NULL,
    
    payment_method_1 VARCHAR(50),
    amount_1 DECIMAL(10,2),
    paid_by_1 VARCHAR(50),
    payment_method_2 VARCHAR(50),
    amount_2 DECIMAL(10,2),
    paid_by_2 VARCHAR(50),
    
    status ENUM('pending', 'settled') DEFAULT 'pending',
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_bill_date (bill_date)
) ENGINE=InnoDB;

-- ============================================
-- INVENTORY TABLE
-- ============================================
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    purchase_rate DECIMAL(10,2) NOT NULL,
    sales_rate DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_product (product)
) ENGINE=InnoDB;

-- ============================================
-- INDENT TABLE (Procurement)
-- ============================================
CREATE TABLE indents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    item VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    sales_rate DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    saved BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_date (date),
    INDEX idx_item (item)
) ENGINE=InnoDB;

-- ============================================
-- SAVINGS ACCOUNTS TABLE
-- ============================================
CREATE TABLE savings_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_name VARCHAR(100) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    account_no VARCHAR(50) UNIQUE NOT NULL,
    scheme VARCHAR(100) NOT NULL,
    principal DECIMAL(10,2) NOT NULL,
    interest DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_account_no (account_no)
) ENGINE=InnoDB;

-- ============================================
-- SAVINGS TRANSACTIONS TABLE
-- ============================================
CREATE TABLE savings_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    date DATE NOT NULL,
    particulars VARCHAR(255) NOT NULL,
    debit DECIMAL(10,2) DEFAULT 0,
    credit DECIMAL(10,2) DEFAULT 0,
    closing_balance DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (account_id) REFERENCES savings_accounts(id) ON DELETE CASCADE,
    INDEX idx_account_date (account_id, date)
) ENGINE=InnoDB;

-- ============================================
-- BANK ACCOUNTS TABLE
-- ============================================
CREATE TABLE bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    ifsc VARCHAR(20) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    opening_balance DECIMAL(10,2) NOT NULL,
    current_balance DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_account_number (account_number)
) ENGINE=InnoDB;

-- ============================================
-- BANK TRANSACTIONS TABLE
-- ============================================
CREATE TABLE bank_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    date DATE NOT NULL,
    particulars VARCHAR(255) NOT NULL,
    debit DECIMAL(10,2) DEFAULT 0,
    credit DECIMAL(10,2) DEFAULT 0,
    closing_balance DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE,
    INDEX idx_account_date (account_id, date)
) ENGINE=InnoDB;

-- ============================================
-- BANK TRANSACTION CATEGORIES TABLE
-- ============================================
CREATE TABLE transaction_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_category_name (name)
) ENGINE=InnoDB;

-- ============================================
-- PIGMY R TABLE (Pigmy Retrieval)
-- ============================================
CREATE TABLE pigmy_r (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    value_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode ENUM('Cash', 'UPI', 'Card', 'Cheque', 'Bank Transfer') NOT NULL,
    paid_by VARCHAR(100) NOT NULL,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_date (date)
) ENGINE=InnoDB;

-- ============================================
-- PIGMY S TABLE (Pigmy Submission - Read-only view)
-- ============================================
CREATE VIEW pigmy_s_view AS
SELECT 
    id,
    date,
    pigmy_s as amount,
    created_by,
    created_at
FROM entries
WHERE pigmy_s > 0;

-- ============================================
-- MAINTENANCE TICKETS TABLE
-- ============================================
CREATE TABLE maintenance_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    issue VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('open', 'in-progress', 'resolved') DEFAULT 'open',
    submitted_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_submitted_by (submitted_by)
) ENGINE=InnoDB;

-- ============================================
-- MAINTENANCE ENTRIES TABLE
-- ============================================
CREATE TABLE maintenance_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    issue VARCHAR(255) NOT NULL,
    work_done_details TEXT NOT NULL,
    done_by VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_date (date),
    INDEX idx_category (category)
) ENGINE=InnoDB;

-- ============================================
-- MAINTENANCE CATEGORIES TABLE
-- ============================================
CREATE TABLE maintenance_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_category (name)
) ENGINE=InnoDB;

-- ============================================
-- LOGS TABLE
-- ============================================
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user VARCHAR(50) NOT NULL,
    user_role VARCHAR(20) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    module VARCHAR(50) NOT NULL,
    
    INDEX idx_timestamp (timestamp),
    INDEX idx_user (user),
    INDEX idx_module (module)
) ENGINE=InnoDB;

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    type ENUM('success', 'info', 'warning', 'error') NOT NULL,
    target_users JSON NOT NULL,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_created_at (timestamp)
) ENGINE=InnoDB;

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Default Users (Password: 'password123' hashed with bcrypt)
INSERT INTO users (username, password_hash, role, status, permissions, edit_access, delete_access, created_date) VALUES
('admin', '$2a$10$YourHashedPasswordHere', 'Admin', 'Active', 
 '{"dashboard":true,"analytics":true,"newEntry":true,"viewEntries":true,"inventory":true,"indent":true,"savings":true,"pigmyS":true,"pigmyR":true,"creditors":true,"staff":true,"attendance":true,"salary":true,"maintenance":true,"raiseTicket":true,"logs":true,"backupRestore":true,"deleteData":true,"manageUsers":true}',
 '{"dashboard":true,"analytics":true,"newEntry":true,"viewEntries":true,"inventory":true,"indent":true,"savings":true,"pigmyS":true,"pigmyR":true,"creditors":true,"staff":true,"attendance":true,"salary":true,"maintenance":true,"raiseTicket":true,"logs":true,"backupRestore":true,"deleteData":true,"manageUsers":true}',
 '{"dashboard":true,"analytics":true,"newEntry":true,"viewEntries":true,"inventory":true,"indent":true,"savings":true,"pigmyS":true,"pigmyR":true,"creditors":true,"staff":true,"attendance":true,"salary":true,"maintenance":true,"raiseTicket":true,"logs":true,"backupRestore":true,"deleteData":true,"manageUsers":true}',
 CURDATE());

-- Default Transaction Categories
INSERT INTO transaction_categories (name) VALUES
('Sales'), ('Expenses'), ('Loans'), ('Investments'), 
('Utilities'), ('Rent'), ('Salary'), ('Other');

-- Default Maintenance Categories
INSERT INTO maintenance_categories (name, icon) VALUES
('ups', 'ri-battery-line'),
('electrical', 'ri-flashlight-line'),
('plumbing', 'ri-drop-line'),
('carpentry', 'ri-hammer-line'),
('network', 'ri-wifi-line'),
('others', 'ri-tools-line');

-- Default Inventory Items
INSERT INTO inventory (product, quantity, unit, purchase_rate, sales_rate) VALUES
('Mutton', 50, 'kg', 400, 500),
('Chicken', 30, 'kg', 180, 220),
('Rice', 100, 'kg', 45, 55),
('Cooking Oil', 25, 'litre', 120, 140);
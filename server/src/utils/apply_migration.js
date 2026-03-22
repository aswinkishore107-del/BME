const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const backupDir = path.join(__dirname, '..', '..', 'database', 'backups');

function timestamp() {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-');
}

(async () => {
  try {
    // Ensure backup dir exists
    fs.mkdirSync(backupDir, { recursive: true });

    console.log('Checking existing columns in users table...');
    const [rows] = await db.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [process.env.DB_NAME]
    );

    const existing = rows.map(r => r.COLUMN_NAME);
    console.log('Existing columns:', existing.join(', '));

    const needed = [
      { name: 'email' },
      { name: 'verification_token' },
      { name: 'verification_expires' },
      { name: 'approval_status' },
    ];

    const missing = needed.filter(n => !existing.includes(n.name)).map(n => n.name);

    if (missing.length === 0) {
      console.log('No missing columns. Migration not required.');
      process.exit(0);
    }

    console.log('Missing columns detected:', missing.join(', '));
    console.log('Creating backup of users table...');

    const [users] = await db.query('SELECT * FROM users');
    const backupFile = path.join(backupDir, `users_backup_${timestamp()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(users, null, 2));
    console.log('Backup saved to', backupFile);

    // Apply column-by-column changes (safe if partially present)
    if (!existing.includes('email') && missing.includes('email')) {
      console.log('Adding column `email`...');
      await db.query("ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE AFTER username");
    }
    if (!existing.includes('verification_token') && missing.includes('verification_token')) {
      console.log('Adding column `verification_token`...');
      await db.query("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) NULL AFTER status");
    }
    if (!existing.includes('verification_expires') && missing.includes('verification_expires')) {
      console.log('Adding column `verification_expires`...');
      await db.query("ALTER TABLE users ADD COLUMN verification_expires DATETIME NULL AFTER verification_token");
    }
    if (!existing.includes('approval_status') && missing.includes('approval_status')) {
      console.log('Adding column `approval_status`...');
      await db.query("ALTER TABLE users ADD COLUMN approval_status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending' AFTER verification_expires");
    }

    console.log('Migration applied successfully. Re-checking columns...');
    const [afterRows] = await db.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [process.env.DB_NAME]
    );
    console.log('Columns now:', afterRows.map(r => r.COLUMN_NAME).join(', '));
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message || err);
    console.error(err);
    process.exit(1);
  }
})();
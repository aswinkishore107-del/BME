const db = require('../config/database');

(async () => {
  try {
    const [cols] = await db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'", [process.env.DB_NAME]);
    const existing = cols.map(c => c.COLUMN_NAME);

    if (!existing.includes('password_reset_token') || !existing.includes('password_reset_expires')) {
      console.log('Applying password reset migration...');
      await db.query("ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255) NULL AFTER verification_expires");
      await db.query("ALTER TABLE users ADD COLUMN password_reset_expires DATETIME NULL AFTER password_reset_token");
      console.log('Migration applied');
    } else {
      console.log('Password reset columns already exist');
    }
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
})();
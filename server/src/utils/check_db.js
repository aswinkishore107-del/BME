const db = require('../config/database');

(async () => {
  try {
    const [rows] = await db.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [process.env.DB_NAME]);

    const cols = rows.map(r => r.COLUMN_NAME);
    console.log('Columns in users table:', cols.join(', '));
    process.exit(0);
  } catch (err) {
    console.error('DB check error:', err);
    process.exit(1);
  }
})();
const db = require('../config/database');

(async () => {
  try {
    const [rows] = await db.query("SELECT id, username, email, created_date, approval_status FROM users WHERE approval_status = 'Pending'");
    console.log('Pending users:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Error listing pending users:', err);
    process.exit(1);
  }
})();
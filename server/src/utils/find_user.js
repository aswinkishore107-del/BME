const db = require('../config/database');
const username = process.argv[2];

(async () => {
  if (!username) {
    console.error('Usage: node src/utils/find_user.js <username>');
    process.exit(1);
  }
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      console.log('User not found');
    } else {
      console.log('User found:', rows[0]);
    }
    process.exit(0);
  } catch (err) {
    console.error('DB query error:', err);
    process.exit(1);
  }
})();
// server/src/controllers/logController.js

const db = require('../config/database');


/* ============================
   GET ALL LOGS
============================ */
exports.getAllLogs = async (req, res) => {
  try {

    const [logs] = await db.query(
      `SELECT * FROM logs ORDER BY timestamp DESC`
    );

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (err) {
    console.error('Get logs error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs'
    });
  }
};


/* ============================
   GET LOGS BY USER
============================ */
exports.getLogsByUser = async (req, res) => {
  try {

    const { username } = req.params;

    const [logs] = await db.query(
      `SELECT * FROM logs WHERE user=? ORDER BY timestamp DESC`,
      [username]
    );

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (err) {
    console.error('Get logs by user error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs'
    });
  }
};


/* ============================
   CLEAR ALL LOGS (ADMIN ONLY)
============================ */
exports.clearLogs = async (req, res) => {
  try {

    await db.query('DELETE FROM logs');

    res.json({
      success: true,
      message: 'All logs cleared'
    });

  } catch (err) {
    console.error('Clear logs error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to clear logs'
    });
  }
};

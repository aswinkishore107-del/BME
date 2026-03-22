// server/src/routes/logs.js

const express = require('express');

const {
  getAllLogs,
  getLogsByUser,
  clearLogs
} = require('../controllers/logController');

const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();


/* ================= ROUTES ================= */

// Get all logs (Admin only)
router.get(
  '/',
  authMiddleware,
  authorize('Admin'),
  getAllLogs
);

// Get logs by username
router.get(
  '/user/:username',
  authMiddleware,
  authorize('Admin'),
  getLogsByUser
);

// Clear logs
router.delete(
  '/',
  authMiddleware,
  authorize('Admin'),
  clearLogs
);

module.exports = router;

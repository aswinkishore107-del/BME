// server/src/routes/entries.js

const express = require('express');

const {
  getAllEntries,
  getEntryByDate,
  createEntry,
  updateEntry,
  deleteEntry
} = require('../controllers/entryController');

const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/', authMiddleware, getAllEntries);

router.get('/date/:date', authMiddleware, getEntryByDate);

router.post(
  '/',
  authMiddleware,
  authorize('Admin', 'Manager'),
  createEntry
);

router.put(
  '/:id',
  authMiddleware,
  authorize('Admin', 'Manager'),
  updateEntry
);

router.delete(
  '/:id',
  authMiddleware,
  authorize('Admin'),
  deleteEntry
);

module.exports = router;

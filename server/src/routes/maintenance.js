const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/maintenanceController');

// Categories
router.get('/categories', authMiddleware, getCategories);
router.post('/categories', authMiddleware, authorize('Admin', 'Manager'), createCategory);
router.put('/categories/:id', authMiddleware, authorize('Admin', 'Manager'), updateCategory);
router.delete('/categories/:id', authMiddleware, authorize('Admin'), deleteCategory);

// Tickets
router.get('/tickets', authMiddleware, getAllTickets);
router.post('/tickets', authMiddleware, createTicket);
router.put('/tickets/:id', authMiddleware, authorize('Admin', 'Manager'), updateTicket);
router.delete('/tickets/:id', authMiddleware, authorize('Admin'), deleteTicket);

// Entries
router.get('/entries', authMiddleware, getAllEntries);
router.post('/entries', authMiddleware, authorize('Admin', 'Manager'), createEntry);
router.put('/entries/:id', authMiddleware, authorize('Admin', 'Manager'), updateEntry);
router.delete('/entries/:id', authMiddleware, authorize('Admin'), deleteEntry);

module.exports = router;

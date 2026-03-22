const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  addTransaction,
  deleteTransaction,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/bankController');

// Categories (must be before /:id to avoid conflict)
router.get('/categories', authMiddleware, getCategories);
router.post('/categories', authMiddleware, authorize('Admin', 'Manager'), createCategory);
router.put('/categories/:id', authMiddleware, authorize('Admin', 'Manager'), updateCategory);
router.delete('/categories/:id', authMiddleware, authorize('Admin'), deleteCategory);

// Accounts
router.get('/', authMiddleware, getAllAccounts);
router.get('/:id', authMiddleware, getAccountById);
router.post('/', authMiddleware, authorize('Admin', 'Manager'), createAccount);
router.put('/:id', authMiddleware, authorize('Admin', 'Manager'), updateAccount);
router.delete('/:id', authMiddleware, authorize('Admin'), deleteAccount);

// Transactions
router.post('/:id/transactions', authMiddleware, authorize('Admin', 'Manager'), addTransaction);
router.delete('/:id/transactions/:txnId', authMiddleware, authorize('Admin'), deleteTransaction);

module.exports = router;
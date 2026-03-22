const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const {
  getAllCreditors,
  createCreditor,
  updateCreditor,
  settleCreditor,
  deleteCreditor
} = require('../controllers/creditorController');

router.get('/', authMiddleware, getAllCreditors);
router.post('/', authMiddleware, authorize('Admin', 'Manager'), createCreditor);
router.put('/:id', authMiddleware, authorize('Admin', 'Manager'), updateCreditor);
router.patch('/:id/settle', authMiddleware, authorize('Admin', 'Manager'), settleCreditor);
router.delete('/:id', authMiddleware, authorize('Admin'), deleteCreditor);

module.exports = router;

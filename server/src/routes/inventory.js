const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const {
  getAllInventory,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/inventoryController');

router.get('/', authMiddleware, getAllInventory);
router.post('/', authMiddleware, authorize('Admin', 'Manager'), createItem);
router.put('/:id', authMiddleware, authorize('Admin', 'Manager'), updateItem);
router.delete('/:id', authMiddleware, authorize('Admin'), deleteItem);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const {
  getAllIndents,
  createIndent,
  updateIndent,
  deleteIndent,
  saveIndent
} = require('../controllers/indentController');

router.get('/', authMiddleware, getAllIndents);
router.post('/', authMiddleware, authorize('Admin', 'Manager'), createIndent);
router.put('/:id', authMiddleware, authorize('Admin', 'Manager'), updateIndent);
router.patch('/:id/save', authMiddleware, authorize('Admin', 'Manager'), saveIndent);
router.delete('/:id', authMiddleware, authorize('Admin'), deleteIndent);

module.exports = router;

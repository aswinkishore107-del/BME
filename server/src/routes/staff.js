const express = require('express');
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  changeStaffStatus
} = require('../controllers/staffController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAllStaff);
router.get('/:id', authMiddleware, getStaffById);
router.post('/', authMiddleware, authorize('Admin', 'Manager'), createStaff);
router.put('/:id', authMiddleware, authorize('Admin', 'Manager'), updateStaff);
router.delete('/:id', authMiddleware, authorize('Admin'), deleteStaff);
router.patch('/:id/status', authMiddleware, authorize('Admin', 'Manager'), changeStaffStatus);

module.exports = router;
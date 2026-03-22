const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const {
  getAllAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendanceController');

router.get('/', authMiddleware, getAllAttendance);
router.post('/', authMiddleware, authorize('Admin', 'Manager'), createAttendance);
router.put('/:id', authMiddleware, authorize('Admin', 'Manager'), updateAttendance);
router.delete('/:id', authMiddleware, authorize('Admin'), deleteAttendance);

module.exports = router;

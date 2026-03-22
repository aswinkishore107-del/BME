const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const { getAllUsers, createUser, getPendingUsers, approveUser, rejectUser } = require('../controllers/userController');

router.get('/', authMiddleware, authorize('Admin', 'Owner', 'User-Admin'), getAllUsers);
router.post('/', authMiddleware, authorize('Admin', 'Owner', 'User-Admin'), createUser);

// Admin endpoints for approvals
router.get('/pending', authMiddleware, authorize('Admin', 'Owner', 'User-Admin'), getPendingUsers);
router.post('/:id/approve', authMiddleware, authorize('Admin', 'Owner', 'User-Admin'), approveUser);
router.post('/:id/reject', authMiddleware, authorize('Admin', 'Owner', 'User-Admin'), rejectUser);

module.exports = router;

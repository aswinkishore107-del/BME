const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const {
  getMonthlySalaries,
  createSalaryPayment,
  updateSalaryPayment,
  deleteSalaryPayment
} = require('../controllers/salaryController');

router.get('/', authMiddleware, getMonthlySalaries);
router.post('/', authMiddleware, authorize('Admin', 'Manager'), createSalaryPayment);
router.put('/:id', authMiddleware, authorize('Admin', 'Manager'), updateSalaryPayment);
router.delete('/:id', authMiddleware, authorize('Admin'), deleteSalaryPayment);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const {
  getAllPigmyR,
  createPigmyR,
  updatePigmyR,
  deletePigmyR,
  getPigmyS
} = require('../controllers/pigmyController');

// Pigmy R (Retrieval)
router.get('/r', authMiddleware, getAllPigmyR);
router.post('/r', authMiddleware, authorize('Admin', 'Manager'), createPigmyR);
router.put('/r/:id', authMiddleware, authorize('Admin', 'Manager'), updatePigmyR);
router.delete('/r/:id', authMiddleware, authorize('Admin'), deletePigmyR);

// Pigmy S (Read-only view from entries)
router.get('/s', authMiddleware, getPigmyS);

module.exports = router;

const express = require('express');

const {
  login,
  register,
  forgotPassword,
  resetPassword,
  getMe,
  logout
} = require('../controllers/authController');

const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/* AUTH ROUTES */

router.post('/login', login);

router.post('/register', register);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.get('/me', authMiddleware, getMe);

router.post('/logout', authMiddleware, logout);

module.exports = router;

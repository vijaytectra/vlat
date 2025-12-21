const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const userController = require('../controllers/userController');

// Get current user (protected route)
router.get('/me', requireAuth, userController.getCurrentUser);

module.exports = router;

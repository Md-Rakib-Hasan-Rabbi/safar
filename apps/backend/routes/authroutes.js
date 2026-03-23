const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

// Signup Route
router.post('/signup', authController.signup);

// Login Route
router.post('/login', authController.login);
router.post('/update-password', authController.updatePassword);
module.exports = router;
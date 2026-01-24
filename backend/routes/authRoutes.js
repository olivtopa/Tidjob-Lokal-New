
const express = require('express');
const { signup, login, getMe, updateProfile, updatePassword, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.delete('/profile', protect, deleteAccount);

module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect); // Ensure logged in
router.use(adminOnly); // Ensure user is 'admin'

router.get('/stats', adminController.getDashboardStats);
router.get('/advanced-stats', adminController.getStatsData); // New Endpoint
router.get('/activity', adminController.getRecentActivity);
router.get('/users', adminController.getAllUsers);
router.get('/requests', adminController.getAllRequests);

module.exports = router;

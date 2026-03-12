const express = require('express');
const router = express.Router();
const {
  createServiceRequest,
  getServiceRequests
} = require('../controllers/serviceRequestController');
const { protect } = require('../middleware/authMiddleware');

// Custom middleware removed as any authenticated user can create requests

router.route('/')
  .post(protect, createServiceRequest)
  .get(getServiceRequests);

module.exports = router;

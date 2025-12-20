const express = require('express');
const router = express.Router();
const {
  createServiceRequest,
  getServiceRequests
} = require('../controllers/serviceRequestController');
const { protect } = require('../controllers/authMiddleware');

// Custom middleware to check for 'client' role
const isClient = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as a client' });
  }
};

// Custom middleware to check for 'provider' role
const isProvider = (req, res, next) => {
  if (req.user && req.user.role === 'provider') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as a provider' });
  }
};

router.route('/')
  .post(protect, isClient, createServiceRequest)
  .get(protect, getServiceRequests);

module.exports = router;

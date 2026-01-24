
const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/servicesController');
const { protect, isProvider } = require('../middleware/authMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, isProvider, createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, isProvider, updateService)
  .delete(protect, isProvider, deleteService);

module.exports = router;

const { ServiceRequest } = require('../models');

// @desc    Create a service request
// @route   POST /api/servicerequests
// @access  Private/Client
const createServiceRequest = async (req, res) => {
  try {
    const { title, description, category, budget } = req.body;
    const serviceRequest = await ServiceRequest.create({
      title,
      description,
      category,
      budget,
      clientId: req.user.id // req.user is set by the 'protect' middleware
    });
    res.status(201).json(serviceRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get all service requests
// @route   GET /api/servicerequests
// @access  Private/Provider
const getServiceRequests = async (req, res) => {
  try {
    // We can add pagination here later if needed
    const serviceRequests = await ServiceRequest.findAll({ 
      include: 'client',
      order: [['createdAt', 'DESC']] 
    });
    res.json(serviceRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createServiceRequest,
  getServiceRequests
};

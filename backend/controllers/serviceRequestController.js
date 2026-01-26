const { ServiceRequest } = require('../models');

// @desc    Create a service request
// @route   POST /api/servicerequests
// @access  Private/Client
const createServiceRequest = async (req, res) => {
  try {
    const { title, description, category, budget, zipCode, city, department } = req.body;
    const serviceRequest = await ServiceRequest.create({
      title,
      description,
      category,
      budget,
      zipCode,
      city,
      department,
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
    let queryOptions = {
      include: 'client',
      order: [['createdAt', 'DESC']]
    };

    // If user is a client, only show their own requests
    if (req.user.role === 'client') {
      queryOptions.where = { clientId: req.user.id };
    }

    const serviceRequests = await ServiceRequest.findAll(queryOptions);
    res.json(serviceRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createServiceRequest,
  getServiceRequests
};

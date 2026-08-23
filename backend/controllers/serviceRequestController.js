const { ServiceRequest } = require('../models');
const { publishToFacebook } = require('../utils/facebookPublisher');

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

    // Send response to client first
    res.status(201).json(serviceRequest);

    // Auto-publish to Facebook asynchronously in background
    publishToFacebook({
      type: 'request',
      title: serviceRequest.title,
      description: serviceRequest.description,
      category: serviceRequest.category,
      budget: serviceRequest.budget,
      zipCode: serviceRequest.zipCode,
      city: serviceRequest.city,
      department: serviceRequest.department,
      id: serviceRequest.id,
      userName: req.user ? req.user.name : null
    });
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
      include: [
        {
          association: 'client',
          attributes: ['id', 'name', 'avatarUrl', 'city', 'zipCode', 'department']
        }
      ],
      order: [['createdAt', 'DESC']]
    };

    // If user is a client, only show their own requests
    if (req.user && req.user.role === 'client') {
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

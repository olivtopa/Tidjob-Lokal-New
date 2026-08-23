
const { Service } = require('../models');

// @desc    Fetch all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    let where = {};
    if (req.query.providerId) {
      where.providerId = req.query.providerId;
    }
    const services = await Service.findAll({
      where,
      include: [
        {
          association: 'provider',
          attributes: ['id', 'name', 'avatarUrl', 'city', 'zipCode', 'department']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Fetch single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [
        {
          association: 'provider',
          attributes: ['id', 'name', 'avatarUrl', 'city', 'zipCode', 'department']
        }
      ]
    });
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const { publishToFacebook } = require('../utils/facebookPublisher');

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Provider
const createService = async (req, res) => {
  try {
    const { title, description, category, price, zipCode, city, department } = req.body;
    const service = await Service.create({
      title,
      description,
      category,
      price,
      zipCode,
      city,
      department,
      providerId: req.user.id
    });

    // Send response to client first
    res.status(201).json(service);

    // Auto-publish to Facebook asynchronously in background
    publishToFacebook({
      type: 'service',
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      zipCode: service.zipCode,
      city: service.city,
      department: service.department,
      id: service.id,
      userName: req.user ? req.user.name : null
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Provider
const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (service) {
      // Check if the user is the owner of the service
      if (service.providerId !== req.user.id) {
        return res.status(403).json({ error: 'User not authorized to update this service' });
      }
      const { title, description, category, price, zipCode, city, department } = req.body;
      service.title = title || service.title;
      service.description = description || service.description;
      service.category = category || service.category;
      service.price = price || service.price;
      service.zipCode = zipCode || service.zipCode;
      service.city = city || service.city;
      service.department = department || service.department;
      await service.save();
      res.json(service);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Provider
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (service) {
      // Check if the user is the owner of the service
      if (service.providerId !== req.user.id) {
        return res.status(403).json({ error: 'User not authorized to delete this service' });
      }
      await service.destroy();
      res.json({ message: 'Service removed' });
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};

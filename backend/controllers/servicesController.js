
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
      include: 'provider'
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
    const service = await Service.findByPk(req.params.id, { include: 'provider' });
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Provider
const createService = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const service = await Service.create({
      title,
      description,
      category,
      price,
      providerId: req.user.id
    });
    res.status(201).json(service);
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
      const { title, description, category, price } = req.body;
      service.title = title || service.title;
      service.description = description || service.description;
      service.category = category || service.category;
      service.price = price || service.price;
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

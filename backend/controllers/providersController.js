const { User } = require('../models');

// @desc    Fetch all providers
// @route   GET /api/providers
// @access  Public
const getProviders = async (req, res) => {
  try {
    const providers = await User.findAll({ 
      where: { role: 'provider' },
      attributes: { exclude: ['password'] } // Exclude password from the result
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProviders
};

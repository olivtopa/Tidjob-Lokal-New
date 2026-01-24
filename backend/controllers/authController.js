
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if input is email or username (name)
    const { Op } = require('sequelize');
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { name: email } // We accept name in the 'email' field from frontend
        ]
      }
    });
    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    // Log the login
    const { LoginLog } = require('../models');
    await LoginLog.create({ UserId: user.id });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.status(200).json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = req.user; // Set by protect middleware

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.avatarUrl = req.body.avatarUrl || user.avatarUrl;

      // Check if password is intended to be updated here, though we recommend a separate route for safety
      if (req.body.password) {
        // We'll leave password update for the dedicated route for better separation
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        // Don't send password
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    if (user && (await user.validPassword(currentPassword))) {
      user.password = newPassword; // Will be hashed by beforeUpdate/beforeSave hook if setup, but check model hooks
      // Wait, the User model hook is beforeCreate. We need to manually hash if there is no beforeUpdate hook or modify the model.
      // Let's check the User model again. It has beforeCreate. It MIGHT NOT have beforeUpdate. 
      // Safe bet: hash it here or ensure hook exists. 
      // Actually checking the User model previously:
      // User.beforeCreate(async (user) => { ... });
      // It DOES NOT have beforeUpdate. So we MUST hash it here or add the hook.
      // Let's hash it here to be safe and avoid altering model logic too much if not verified.
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ error: 'Invalid current password' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/profile
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const user = req.user;
    await user.destroy();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, login, getMe, updateProfile, updatePassword, deleteAccount };

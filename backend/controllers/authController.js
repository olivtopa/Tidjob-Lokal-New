
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const sendEmail = require('../utils/sendEmail');

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });

    // Generate token immediately after signup
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
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

    // Extended expiration to 30 days
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
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

// @desc    Forgot Password - Send reset email
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field in DB
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (e.g., 10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset url
    // If running deeply local (emulator), logic might differ, but generally generic link works 
    // Usually frontend URL. Let's assume frontend is handling the route /resetpassword/:resetToken
    // If backend and frontend are same origin/port during dev (often not), user needs the FRONTEND URL.
    // For now we return the token in response too for easy dev testing, but email should contain link.
    const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
    // WAIT: req.get('host') gives backend host. If frontend is different (React Native/Expo), deep link is needed.
    // Since this is a React Web App (Tidjob-Lokal-New implies web stack often), let's assume standard web link.
    // But honestly, for this "Simple" request, sending the CODE (token) is often easier to type on mobile than a link if deep linking isn't setup.
    // Let's send a simple message with the token.

    const message = `Vous avez demandé la réinitialisation de votre mot de passe. \n\nVeuillez utiliser ce jeton pour réinitialiser votre mot de passe : \n\n ${resetToken} \n\n Ce lien expire dans 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Réinitialisation de mot de passe - Tidjob Lokal',
        message
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save();
      return res.status(500).json({ error: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpire: { [require('sequelize').Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Set new password
    const { password } = req.body;

    // Hash password manually as we did in updatePassword (since hooks might be missing for update)
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    // Log the user in directly? Or ask to login? Usually ask to login.
    // We can return a token if we want to auto-login.
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({ success: true, token, message: 'Password updated successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
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

module.exports = { signup, login, getMe, updateProfile, updatePassword, deleteAccount, forgotPassword, resetPassword };

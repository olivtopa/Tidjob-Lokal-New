const express = require('express');
const router = express.Router();
const authMiddleware = require('../controllers/authMiddleware');
const { Subscription } = require('../models');

// @desc    Subscribe to push notifications
// @route   POST /api/notifications/subscribe
// @access  Private
router.post('/subscribe', authMiddleware.protect, async (req, res) => {
    const subscription = req.body;
    const userId = req.user.id;

    try {
        // Check if subscription already exists
        const [sub, created] = await Subscription.findOrCreate({
            where: { endpoint: subscription.endpoint },
            defaults: {
                userId,
                endpoint: subscription.endpoint,
                keys: subscription.keys,
                expirationTime: subscription.expirationTime
            }
        });

        if (!created) {
            // Update keys or user if endpoint exists
            sub.userId = userId;
            sub.keys = subscription.keys;
            sub.expirationTime = subscription.expirationTime;
            await sub.save();
        }

        res.status(201).json({ message: 'Subscription added successfully.' });
    } catch (error) {
        console.error('Error adding subscription:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../controllers/authMiddleware');

// Get all conversations for the authenticated user (client or provider)
router.get('/', authMiddleware.protect, messageController.getConversations);

// Get messages for a specific conversation
router.get('/:conversationId/messages', authMiddleware.protect, messageController.getMessages);

// Start a new conversation (typically by a client for a service request)
router.post('/', authMiddleware.protect, messageController.startConversation);

// Send a message in an existing conversation
router.post('/:conversationId/messages', authMiddleware.protect, messageController.sendMessage);

module.exports = router;
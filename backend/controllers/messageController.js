const { Conversation, Message, User, ServiceRequest, Service } = require('../models');
const { Op } = require('sequelize');

// Helper to include necessary associations for conversations
const conversationIncludeOptions = [
  { model: User, as: 'client', attributes: ['id', 'name', 'avatarUrl'] },
  { model: User, as: 'provider', attributes: ['id', 'name', 'avatarUrl'] },
  { 
    model: ServiceRequest, 
    as: 'serviceRequest', 
    attributes: ['id', 'title', 'description', 'category'],
    include: [{ model: Service, as: 'service', attributes: ['id', 'title', 'category'] }]
  },
  { 
    model: Message, 
    as: 'messages',
    attributes: ['id', 'content', 'timestamp', 'senderId'],
    include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatarUrl'] }],
    order: [['timestamp', 'ASC']]
  }
];

// @desc    Get all conversations for the authenticated user
// @route   GET /api/messages
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is populated by authMiddleware

    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { clientId: userId },
          { providerId: userId }
        ]
      },
      include: conversationIncludeOptions,
      order: [['lastMessageAt', 'DESC']],
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get messages for a specific conversation
// @route   GET /api/messages/:conversationId/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findByPk(conversationId, {
      include: conversationIncludeOptions,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Ensure the user is part of this conversation
    if (conversation.clientId !== userId && conversation.providerId !== userId) {
      return res.status(403).json({ message: 'Not authorized to access this conversation' });
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Start a new conversation
// @route   POST /api/messages
// @access  Private (Client only)
exports.startConversation = async (req, res) => {
  try {
    const { serviceId, providerId, initialMessageContent } = req.body;
    const clientId = req.user.id; // Client initiating the conversation

    // Check if a conversation already exists for this service between these two users
    let conversation = await Conversation.findOne({
      where: {
        serviceId,
        clientId,
        providerId,
      },
    });

    if (conversation) {
      // If conversation exists, just return it (or add a message if initialMessageContent is provided)
      // For now, we'll just return the existing one.
      const messages = await Message.findAll({
        where: { conversationId: conversation.id },
        order: [['timestamp', 'ASC']],
        include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatarUrl'] }],
      });
      return res.status(200).json({ ...conversation.toJSON(), messages });
    }

    // Create new conversation
    conversation = await Conversation.create({
      serviceId,
      clientId,
      providerId,
      lastMessageAt: new Date(),
    });

    // Add initial message if provided
    if (initialMessageContent) {
      await Message.create({
        conversationId: conversation.id,
        senderId: clientId,
        content: initialMessageContent,
        timestamp: new Date(),
      });
    }

    // Fetch the newly created conversation with all associations
    const newConversation = await Conversation.findByPk(conversation.id, {
      include: conversationIncludeOptions,
    });

    res.status(201).json(newConversation);
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Send a message in an existing conversation
// @route   POST /api/messages/:conversationId/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Ensure sender is part of this conversation
    if (conversation.clientId !== senderId && conversation.providerId !== senderId) {
      return res.status(403).json({ message: 'Not authorized to send message in this conversation' });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content,
      timestamp: new Date(),
    });

    // Update lastMessageAt for the conversation
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Fetch the created message with sender details
    const fullMessage = await Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatarUrl'] }],
    });

    res.status(201).json(fullMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

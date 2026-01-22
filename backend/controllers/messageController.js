const { Conversation, Message, User, ServiceRequest, Service } = require('../models');
const { Op } = require('sequelize');

// Helper to include necessary associations for conversations
const conversationIncludeOptions = [
  { model: User, as: 'client', attributes: ['id', 'name', 'avatarUrl'] },
  { model: User, as: 'provider', attributes: ['id', 'name', 'avatarUrl'] },
  {
    model: Service,
    as: 'service',
    attributes: ['id', 'title', 'category']
  },
  {
    model: ServiceRequest,
    as: 'serviceRequest',
    attributes: ['id', 'title', 'category']
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

    // Compute 'unread' status for each conversation
    const conversationsWithUnread = conversations.map(conv => {
      const c = conv.toJSON();
      const isClient = c.clientId === userId;
      const lastReadAt = isClient ? c.clientLastReadAt : c.providerLastReadAt;

      // If never read, it's unread if there are messages.
      // If read, check if lastMessageAt is newer than lastReadAt.
      let unread = false;
      if (!lastReadAt) {
        unread = true;
        // Optional refinement: if I AM the sender of the last message, it shouldn't be unread for me.
        if (c.messages && c.messages.length > 0) {
          const lastMsg = c.messages[c.messages.length - 1];
          if (lastMsg.senderId === userId) unread = false;
        } else {
          unread = false; // No messages, so not unread
        }
      } else {
        unread = new Date(c.lastMessageAt) > new Date(lastReadAt);
        // Same refinement: if I sent the last message, it's read (or rather, not unread)
        if (c.messages && c.messages.length > 0) {
          const lastMsg = c.messages[c.messages.length - 1];
          if (lastMsg.senderId === userId) unread = false;
        }
      }

      return { ...c, unread };
    });

    res.status(200).json(conversationsWithUnread);
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

    // Mark as read
    if (conversation.clientId === userId) {
      conversation.clientLastReadAt = new Date();
    } else {
      conversation.providerLastReadAt = new Date();
    }
    await conversation.save();

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Start a new conversation
// @route   POST /api/messages
// @access  Private (Client or Provider)
exports.startConversation = async (req, res) => {
  try {
    const { ServiceId, ServiceRequestId, providerId, initialMessageContent } = req.body;
    const currentUserId = req.user.id;

    // Validation: Must have either ServiceId or ServiceRequestId
    if (!ServiceId && !ServiceRequestId) {
      return res.status(400).json({ message: 'ServiceId or ServiceRequestId is required.' });
    }

    // Determine participants
    // If ServiceId is present, it's a client contacting a provider about a Service.
    // If ServiceRequestId is present, it's a provider contacting a client about a ServiceRequest.

    let clientId, targetProviderId;

    if (ServiceId) {
      // Client contacting Provider
      clientId = currentUserId;
      targetProviderId = providerId;
      if (!targetProviderId) return res.status(400).json({ message: 'providerId is required when starting conversation from a Service.' });
    } else {
      // Provider contacting Client (via ServiceRequest)
      // For ServiceRequest, the 'client' is the one who made the request.
      // The 'provider' is the current user responding to it.
      const request = await ServiceRequest.findByPk(ServiceRequestId);
      if (!request) return res.status(404).json({ message: 'ServiceRequest not found.' });

      clientId = request.clientId; // The user who posted the request
      targetProviderId = currentUserId; // The provider responding
    }

    // Check if a conversation already exists
    let whereClause = {
      clientId,
      providerId: targetProviderId,
    };

    if (ServiceId) whereClause.ServiceId = ServiceId;
    if (ServiceRequestId) whereClause.ServiceRequestId = ServiceRequestId;

    let conversation = await Conversation.findOne({ where: whereClause });

    if (conversation) {
      const fullConversation = await Conversation.findByPk(conversation.id, { include: conversationIncludeOptions });
      return res.status(200).json(fullConversation);
    }

    // Create new conversation
    conversation = await Conversation.create({
      ServiceId: ServiceId || null,
      ServiceRequestId: ServiceRequestId || null,
      clientId,
      providerId: targetProviderId,
      lastMessageAt: new Date(),
    });

    // Add initial message if provided
    if (initialMessageContent) {
      await Message.create({
        conversationId: conversation.id,
        senderId: currentUserId,
        content: initialMessageContent,
        timestamp: new Date(),
      });
    }

    const newConversation = await Conversation.findByPk(conversation.id, {
      include: conversationIncludeOptions,
    });

    res.status(201).json(newConversation);
  } catch (error) {
    console.error('Error starting conversation:', error);
    console.error('Error details:', JSON.stringify(error, null, 2)); // Log full error details
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

    // --- Notification Logic Removed (Visual Notifications used instead) ---
    // The previous push notification logic has been replaced by the 'unread' status
    // on the conversation object, which drives the in-app "Red Bell" and App Badge.
    // --------------------------

    res.status(201).json(fullMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

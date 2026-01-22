
const sequelize = require('../config/database');
const User = require('./User');
const Service = require('./Service');
const ServiceRequest = require('./ServiceRequest');
const Conversation = require('./Conversation');
const Message = require('./Message');
const Subscription = require('./Subscription');

// User-Service relationship (a provider has many services)
User.hasMany(Service, { as: 'offeredServices', foreignKey: 'providerId' });
Service.belongsTo(User, { as: 'provider', foreignKey: 'providerId' });

// User-ServiceRequest relationship (a client has many service requests)
User.hasMany(ServiceRequest, { as: 'requestedServices', foreignKey: 'clientId' });
ServiceRequest.belongsTo(User, { as: 'client', foreignKey: 'clientId' });

// Conversation relationships
// A conversation is between a client and a provider regarding a service
Conversation.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
Conversation.belongsTo(User, { as: 'provider', foreignKey: 'providerId' });
Conversation.belongsTo(Service, { as: 'service', foreignKey: 'ServiceId' });
Conversation.belongsTo(ServiceRequest, { as: 'serviceRequest', foreignKey: 'ServiceRequestId' });

// Message relationships
// A message belongs to a conversation and is sent by a user
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
Conversation.hasMany(Message, { as: 'messages', foreignKey: 'conversationId' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });

// Subscription relationships
User.hasMany(Subscription, { as: 'subscriptions', foreignKey: 'userId' });
Subscription.belongsTo(User, { as: 'user', foreignKey: 'userId' });

const db = {
  sequelize,
  User,
  Service,
  ServiceRequest,
  Conversation,
  Message,
  Subscription
};

module.exports = db;

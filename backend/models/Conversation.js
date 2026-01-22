
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  clientLastReadAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  providerLastReadAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // ServiceId is now optional because a conversation can be about a ServiceRequest
  ServiceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Services',
      key: 'id',
    },
  },
  // Add ServiceRequestId to link conversation to a service request
  ServiceRequestId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ServiceRequests',
      key: 'id',
    },
  },
});

module.exports = Conversation;

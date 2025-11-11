
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  // Add ServiceId to link conversation to a service
  ServiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Services', // 'Services' is the table name
      key: 'id',
    },
  },
});

module.exports = Conversation;


const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  // No specific fields needed for the conversation itself,
  // relationships will define the participants and subject.
});

module.exports = Conversation;

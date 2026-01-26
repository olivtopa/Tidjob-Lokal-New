
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceRequest = sequelize.define('ServiceRequest', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'completed'),
    defaultValue: 'open'
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true // Allow null for existing records to avoid sync errors initially
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  providerId: { // providerId to track who is assigned/realizing the request
    type: DataTypes.INTEGER, // Check User ID type, usually INTEGER or UUID. server.js implies auto-increment ID? Let's check User.js
    allowNull: true
    // References User defined in models/index.js usually
  }
});

module.exports = ServiceRequest;

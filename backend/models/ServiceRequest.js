
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
  }
});

module.exports = ServiceRequest;

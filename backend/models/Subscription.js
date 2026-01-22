const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscription = sequelize.define('Subscription', {
    endpoint: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    expirationTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    keys: {
        type: DataTypes.JSON, // Use JSON for storing auth and p256dh keys
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Make sure this matches your User table name
            key: 'id'
        }
    }
});

module.exports = Subscription;

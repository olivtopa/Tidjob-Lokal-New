const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const LoginLog = sequelize.define('LoginLog', {
    loginAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Associations
LoginLog.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(LoginLog);

module.exports = LoginLog;

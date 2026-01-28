require('dotenv').config();
const { sequelize, User, Service, ServiceRequest, Conversation, Message, Subscription, LoginLog } = require('../models');
const { Op } = require('sequelize');

const cleanDatabase = async () => {
    try {
        console.log('🚧 Starting database cleanup for production...');

        // 1. Delete dependent data first
        console.log('🗑️  Deleting Messages...');
        await Message.destroy({ where: {}, truncate: false });

        console.log('🗑️  Deleting Conversations...');
        await Conversation.destroy({ where: {}, truncate: false });

        console.log('🗑️  Deleting Login Logs...');
        await LoginLog.destroy({ where: {}, truncate: false });

        console.log('🗑️  Deleting Subscriptions...');
        await Subscription.destroy({ where: {}, truncate: false });

        // 2. Delete main content
        console.log('🗑️  Deleting Service Requests...');
        await ServiceRequest.destroy({ where: {}, truncate: false });

        console.log('🗑️  Deleting Services...');
        await Service.destroy({ where: {}, truncate: false });

        // 3. Delete Users except Admin
        console.log('🗑️  Deleting Users (keeping admin)...');
        // Identify admins by role 'admin' OR name 'admin' to be safe, based on seeder
        await User.destroy({
            where: {
                role: { [Op.ne]: 'admin' }, // Delete everyone who is NOT admin
                name: { [Op.ne]: 'admin' }  // Extra safety
            }
        });

        console.log('✅ Database cleanup complete!');
        console.log('✨ The system is now ready for production users.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error cleaning database:', error);
        process.exit(1);
    }
};

cleanDatabase();

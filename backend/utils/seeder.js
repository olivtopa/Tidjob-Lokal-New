const { User } = require('../models');

const seedAdminUser = async () => {
    try {
        const adminUser = await User.findOne({ where: { name: 'admin' } });
        if (!adminUser) {
            console.log('🌱 Seeding default admin user...');
            await User.create({
                name: 'admin',
                email: 'admin@tidjob.com', // Placeholder email as it is required
                password: 'admin', // Will be hashed by hooks
                role: 'admin'
            });
            console.log('✅ Admin user created. Login with username "admin" and password "admin".');
        } else {
            // Check if role is admin, update if not? No, just leave it.
            // console.log('ℹ️ Admin user already exists.');
        }
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
    }
};

module.exports = seedAdminUser;

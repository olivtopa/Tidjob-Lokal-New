const { User, Service, ServiceRequest, LoginLog } = require('../models');
const bcrypt = require('bcryptjs');

const seedDashboardData = async () => {
    try {
        console.log('🌱 Seeding Dashboard Data...');

        // 1. Create Users
        const hashedPassword = await bcrypt.hash('password', 10);

        let provider1 = await User.findOne({ where: { email: 'jardin@test.com' } });
        if (!provider1) {
            provider1 = await User.create({ name: 'Jardinier Pro', email: 'jardin@test.com', password: hashedPassword, role: 'provider' });
        }

        let provider2 = await User.findOne({ where: { email: 'maths@test.com' } });
        if (!provider2) {
            provider2 = await User.create({ name: 'Prof Maths', email: 'maths@test.com', password: hashedPassword, role: 'provider' });
        }

        let client1 = await User.findOne({ where: { email: 'alice@test.com' } });
        if (!client1) {
            client1 = await User.create({ name: 'Alice Client', email: 'alice@test.com', password: hashedPassword, role: 'client' });
        }

        let client2 = await User.findOne({ where: { email: 'bob@test.com' } });
        if (!client2) {
            client2 = await User.create({ name: 'Bob Client', email: 'bob@test.com', password: hashedPassword, role: 'client' });
        }

        // 2. Create Services (Offers)
        // Ensure providerId is set (new field)
        await Service.create({ title: 'Tonte de pelouse', description: 'Jardinage expert', category: 'Jardinage', price: 50, providerId: provider1.id });
        await Service.create({ title: 'Taille de haies', description: 'Rapidité et propreté', category: 'Jardinage', price: 80, providerId: provider1.id });
        await Service.create({ title: 'Cours de Maths Lycée', description: 'Préparation Bac', category: 'Cours', price: 30, providerId: provider2.id });

        // 3. Create Service Requests
        // Some assigned (performed), some open
        // Check if exists to avoid dupes if run multiple times? (Simplification: just create, might duplicate but ok for dev)
        await ServiceRequest.create({ title: 'Cherche jardinier', description: 'Pour 500m2', category: 'Jardinage', budget: 60, clientId: client1.id, providerId: provider1.id, status: 'completed' });
        await ServiceRequest.create({ title: 'Ménage de printemps', description: 'Grand nettoyage', category: 'Ménage', budget: 100, clientId: client2.id, providerId: null, status: 'open' }); // Unassigned
        await ServiceRequest.create({ title: 'Cours de physique', description: 'Niveau 3ème', category: 'Cours', budget: 25, clientId: client1.id, providerId: provider2.id, status: 'in_progress' });

        // 4. Create Login Logs for Graph
        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        await LoginLog.create({ UserId: client1.id, loginAt: today });
        await LoginLog.create({ UserId: provider1.id, loginAt: today });
        await LoginLog.create({ UserId: client2.id, loginAt: yesterday });
        await LoginLog.create({ UserId: client1.id, loginAt: yesterday });
        await LoginLog.create({ UserId: provider2.id, loginAt: twoDaysAgo });

        console.log('✅ Dashboard Data Seeded Successfully');

    } catch (error) {
        console.error('❌ Error seeding dashboard data:', error);
    }
};

module.exports = seedDashboardData;

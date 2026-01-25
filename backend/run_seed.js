const path = require('path');
const result = require('dotenv').config({ path: path.join(__dirname, '.env') });
if (result.error) {
    console.error('Error loading .env:', result.error);
}
console.log('Loaded env vars. DATABASE_URL is:', process.env.DATABASE_URL ? 'SET' : 'MISSING');
const seedDashboardData = require('./utils/seedDashboard');
const sequelize = require('./config/database');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await seedDashboardData();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close(); // Ensure connection closes
    }
};

run();

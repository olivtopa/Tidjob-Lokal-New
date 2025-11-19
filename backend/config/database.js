const { Sequelize } = require('sequelize');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DATABASE_URL environment variable is not set.');
  // We don't throw here to allow server.js to start and log the error properly.
  // Sequelize will likely fail to connect later.
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ...(process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {})
  }
});

module.exports = sequelize;

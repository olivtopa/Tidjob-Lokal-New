const { Sequelize } = require('sequelize');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not set. Please provide a valid database connection string.');
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

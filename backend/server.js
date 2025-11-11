
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/servicesRoutes');
const providerRoutes = require('./routes/providersRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/servicerequests', serviceRequestRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.send('Tidjob Lokal Backend is running!');
});

// Sync database and start server
db.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log('✅ Database synchronized.');
  });
}).catch(err => {
  console.error('❌ Unable to connect to the database:', err);
});

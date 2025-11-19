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
const messageRoutes = require('./routes/messageRoutes');

// CORS Configuration
// TEMPORARY DEBUGGING: Allow all origins to rule out CORS issues
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/servicerequests', serviceRequestRoutes);
app.use('/api/messages', messageRoutes); // New: Use message routes

// Basic health check route
app.get('/', (req, res) => {
  res.send('Tidjob Lokal Backend is running!');
});

// Sync database and start server
// Start server immediately to handle requests (and CORS) even if DB fails
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Attempt to sync database
db.sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synchronized.');
}).catch(err => {
  console.error('❌ Unable to connect to the database:', err);
  console.error('⚠️ Server is running but database is not connected. API calls may fail.');
});

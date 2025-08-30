const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB!');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Import routes
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const jobRoutes = require('./routes/jobs');  // 👈 ADD THIS LINE
const matchingRoutes = require('./routes/matching');  // 👈 ADD THIS

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);  // 👈 ADD THIS LINE
app.use('/api/matching', matchingRoutes);  // 👈 ADD THIS

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello! Your Resume Matcher server is working!',
    database: 'Connected to Local MongoDB!',
    routes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/resume/upload',
      'GET /api/resume/skills',
      'GET /api/jobs',  // 👈 ADD THIS LINE
      'GET /api/jobs/category/:category',  // 👈 ADD THIS LINE
      'GET /api/jobs/:id',  // 👈 ADD THIS LINE
      'POST /api/matching/analyze',
      'POST /api/matching/quick-match',
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Database: Local MongoDB`);
  console.log(`🔐 Auth routes: /api/auth/*`);
  console.log(`📄 Resume routes: /api/resume/*`);
  console.log(`💼 Job routes: /api/jobs/*`);  // 👈 ADD THIS LINE
  console.log(`🎯 Matching routes: /api/matching/*`);  // 👈 ADD THIS
});
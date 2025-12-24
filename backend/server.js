const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const db = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow credentials (cookies) from frontend
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    const allowedOrigins = [
      'http://localhost:3000',
      'https://72230776-cmd.github.io',
      'https://72230776-cmd.github.io/hebaWebProj',
      frontendUrl
    ];
    
    if (!origin || allowedOrigins.includes(origin) || origin.includes('72230776-cmd.github.io')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Important: allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));

// Middleware
app.use(cookieParser()); // Parse cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully');
    connection.release();
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes')); // User routes (authenticated)
app.use('/api/admin', require('./routes/adminRoutes')); // Admin routes (authenticated + admin)
app.use('/api/contact', require('./routes/contactRoutes')); // Public contact routes
app.use('/api/booking', require('./routes/bookingRoutes')); // Public booking routes

// Public product route (for users to view products)
app.get('/api/products', require('./controllers/productController').getAllProducts);

// Setup route to create tables (can be called once)
app.post('/api/setup/tables', require('./controllers/setupController').createTables);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Africa Website Backend API',
    status: 'running',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});


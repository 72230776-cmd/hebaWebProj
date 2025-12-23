const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token from httpOnly cookie
exports.authenticate = async (req, res, next) => {
  try {
    // Debug: Log cookie info
    console.log('🔐 Auth middleware - Cookies:', req.cookies || 'No cookies object');
    console.log('🔐 Auth middleware - JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Get token from httpOnly cookie (more secure than header)
    // Ensure req.cookies exists (cookie-parser should set it, but check anyway)
    const cookies = req.cookies || {};
    const token = cookies.token;
    
    if (!token) {
      console.log('❌ No token in cookies');
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in.'
      });
    }

    console.log('✅ Token found in cookie, verifying...');
    
    // Verify token
    const secret = process.env.JWT_SECRET || 'africa_market_super_secret_jwt_key_2024_secure_random_string';
    if (!secret) {
      console.error('❌ JWT_SECRET is not set!');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }
    
    const decoded = jwt.verify(token, secret);
    console.log('✅ Token verified, userId:', decoded.userId, 'role:', decoded.role);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // Check if user is active (not disabled)
    if (user.is_active === false || user.is_active === 0) {
      return res.status(401).json({
        success: false,
        message: 'User account is disabled'
      });
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('🔴 Auth middleware error:', error.name, error.message);
    console.error('🔴 Full error stack:', error.stack);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    // Catch any other errors (like database errors, null reference, etc.)
    console.error('🔴 Unexpected error in auth middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Check if user is regular user or admin
exports.isUserOrAdmin = (req, res, next) => {
  if (req.user.role !== 'user' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Invalid user role.'
    });
  }
  next();
};


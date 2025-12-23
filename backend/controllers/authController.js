const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'africa_market_super_secret_jwt_key_2024_secure_random_string';
  return jwt.sign(
    { userId, role },
    secret,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password'
      });
    }

    // Check if user already exists
    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const existingUserByUsername = await User.findByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // All registrations are automatically 'user' role (admin is hardcoded)
    // Role parameter is ignored for security - admin can only be created via setup script

    // Create user with 'user' role only
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'user' // Always 'user' - admin is hardcoded in setup
    });

    // Generate token
    const token = generateToken(newUser.id, newUser.role);
    console.log('🔑 Token generated for new user:', newUser.username);

    // Set JWT in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents XSS attacks - JavaScript cannot access this cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/' // Ensure cookie is available for all paths
    });
    console.log('✅ Cookie set successfully');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);
    console.log('🔑 Token generated for user:', user.username);

    // Set JWT in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents XSS attacks - JavaScript cannot access this cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/' // Ensure cookie is available for all paths
    });
    console.log('✅ Cookie set successfully');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    // Check if req.user exists (set by authenticate middleware)
    if (!req.user || !req.user.userId) {
      console.error('❌ getProfile: req.user is missing');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('🔴 Get profile error:', error);
    console.error('🔴 Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({
    success: true,
    message: 'Logout successful'
  });
};


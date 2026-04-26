const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const authMiddleware = require('../middleware/auth');

// Use the Google Client ID from environment variables
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user has a password (not a Google-only user)
    if (!user.password) {
      return res.status(401).json({ 
        message: 'This account was created with Google. Please use Google Sign-In or reset your password.' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Send response without password
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      password,
      name
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Send response without password
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login route (does NOT create a new user)
router.post('/google-login', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is missing' });
    }

    console.log('Verifying Google access token...');
    
    // Get user info from Google using the access token
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const userInfo = await userInfoResponse.json();
    console.log('Google user info:', userInfo);

    const { sub: googleId, email, name, picture } = userInfo;

    if (!email) {
      return res.status(401).json({ message: 'Invalid Google user info' });
    }

    // Check if user exists in your database
    let user = await User.findOne({ email });

    if (user) {
      // Update user's Google ID and profile image if not set
      if (!user.googleId || !user.profileImage) {
        user.googleId = googleId;
        user.profileImage = picture;
        await user.save();
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      const userResponse = {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage
      };

      return res.json({
        token,
        user: userResponse
      });
    }

    // User not found -> do not create here
    return res.status(404).json({
      message: 'Account not created. Please sign up first.'
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ 
      message: 'Google authentication failed',
      error: error.message 
    });
  }
});

// Google Signup route (creates a new user if not exists)
router.post('/google-signup', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is missing' });
    }

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const userInfo = await userInfoResponse.json();
    const { sub: googleId, email, name, picture } = userInfo;

    if (!email) {
      return res.status(401).json({ message: 'Invalid Google user info' });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: 'Account already exists. Please log in.' });
    }

    // Create new user
    user = new User({
      email,
      name,
      googleId,
      profileImage: picture
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage
    };

    // Return 201 on successful signup. Client may choose not to auto-login.
    return res.status(201).json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Google signup error:', error);
    res.status(500).json({ 
      message: 'Google signup failed',
      error: error.message 
    });
  }
});

module.exports = router; 
 
// Profile routes
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to load profile' });
  }
});

router.put('/me', authMiddleware, async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'profileImage', 'title', 'location', 'phone', 'website',
      'socials', 'bio', 'education', 'skills', 'experience', 'languages',
      'certifications', 'careerGoals'
    ];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: user, message: 'Profile updated' });
  } catch (e) {
    console.error('Profile update error:', e);
    res.status(400).json({ success: false, message: 'Failed to update profile', error: e.message });
  }
});
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const authMiddleware = require('../middleware/auth');

// Use the Google Client ID from environment variables
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function fetchGoogleUserInfo(accessToken) {
  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!userInfoResponse.ok) {
    const errText = await userInfoResponse.text().catch(() => '');
    throw new Error(`Failed to get user info from Google (${userInfoResponse.status})${errText ? `: ${errText}` : ''}`);
  }

  return userInfoResponse.json();
}

function resolveGoogleDisplayName(userInfo) {
  const { name, given_name, family_name, email } = userInfo;
  if (name && name.trim()) return name.trim();
  const fromParts = [given_name, family_name].filter(Boolean).join(' ').trim();
  if (fromParts) return fromParts;
  if (email) return email.split('@')[0];
  return 'Google User';
}

function buildUserResponse(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    profileImage: user.profileImage ?? null
  };
}

function issueAuthToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
}

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

    const userInfo = await fetchGoogleUserInfo(accessToken);
    const { sub: googleId, email, picture } = userInfo;

    if (!email) {
      return res.status(401).json({ message: 'Invalid Google user info' });
    }

    let user = await User.findOne({ email });

    if (user) {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (picture && !user.profileImage) {
        user.profileImage = picture;
        updated = true;
      }
      if (!user.name?.trim()) {
        user.name = resolveGoogleDisplayName(userInfo);
        updated = true;
      }
      if (updated) {
        await user.save();
      }

      const token = issueAuthToken(user);
      return res.json({
        token,
        user: buildUserResponse(user)
      });
    }

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

// Google Signup route (creates a new user, or signs in if account already exists)
router.post('/google-signup', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is missing' });
    }

    const userInfo = await fetchGoogleUserInfo(accessToken);
    const { sub: googleId, email, picture } = userInfo;

    if (!email) {
      return res.status(401).json({ message: 'Invalid Google user info' });
    }

    const displayName = resolveGoogleDisplayName(userInfo);
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (user) {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (picture && !user.profileImage) {
        user.profileImage = picture;
        updated = true;
      }
      if (!user.name?.trim()) {
        user.name = displayName;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      user = new User({
        email,
        name: displayName,
        googleId,
        profileImage: picture || null
      });
      await user.save();
      isNewUser = true;
    }

    const token = issueAuthToken(user);
    return res.status(isNewUser ? 201 : 200).json({
      token,
      user: buildUserResponse(user),
      isNewUser
    });
  } catch (error) {
    console.error('Google signup error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid user data from Google',
        error: error.message
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Account already exists. Please log in.'
      });
    }
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
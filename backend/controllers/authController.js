import User from '../models/User.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth.js';
import Analytics from '../models/Analytics.js';

// Register user
export const register = async (req, res) => {
  try {
    const { username, email, password, profile, preferences } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmailOrUsername(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username',
        errors: ['User already exists']
      });
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      profile: profile || {},
      preferences: preferences || {}
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add refresh token to user
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // Track registration event
    try {
      await Analytics.trackEvent({
        eventType: 'register',
        userId: user._id,
        data: {
          metadata: {
            registrationMethod: 'email',
            source: req.headers.referer || 'direct'
          }
        },
        device: {
          type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
          userAgent: req.headers['user-agent']
        },
        location: {
          ip: req.ip
        }
      });
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError);
    }

    // Return user data (without password)
    const userData = user.getPublicProfile();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userData,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      errors: ['Internal server error']
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or username
    const user = await User.findByEmailOrUsername(identifier).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: ['Invalid email/username or password']
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        errors: ['Account deactivated']
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: ['Invalid email/username or password']
      });
    }

    // Update login info
    user.lastLogin = new Date();
    user.loginCount += 1;
    user.isOnline = true;
    
    if (!user.firstLogin) {
      user.firstLogin = new Date();
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add refresh token to user
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // Track login event
    try {
      await Analytics.trackEvent({
        eventType: 'login',
        userId: user._id,
        data: {
          metadata: {
            loginMethod: 'email',
            source: req.headers.referer || 'direct'
          }
        },
        device: {
          type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
          userAgent: req.headers['user-agent']
        },
        location: {
          ip: req.ip
        }
      });
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError);
    }

    // Return user data (without password)
    const userData = user.getPublicProfile();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      errors: ['Internal server error']
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user._id;

    // Remove refresh token from user
    if (refreshToken) {
      await User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: { token: refreshToken } }
      });
    }

    // Set user offline
    await User.findByIdAndUpdate(userId, {
      isOnline: false
    });

    // Track logout event
    try {
      await Analytics.trackEvent({
        eventType: 'logout',
        userId: userId,
        data: {
          metadata: {
            logoutMethod: 'manual'
          }
        },
        device: {
          type: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
          userAgent: req.headers['user-agent']
        },
        location: {
          ip: req.ip
        }
      });
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      errors: ['Internal server error']
    });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      message: 'User data retrieved successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      errors: ['Internal server error']
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required',
        errors: ['Refresh token required']
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        errors: ['Invalid refresh token']
      });
    }

    const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        errors: ['Invalid refresh token']
      });
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: user.getPublicProfile(),
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        errors: ['Invalid refresh token']
      });
    }

    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      errors: ['Internal server error']
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    // Remove sensitive fields
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;
    delete updateData.isActive;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        ...updateData,
        lastModifiedBy: userId
      },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User not found']
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile update failed',
      errors: ['Internal server error']
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User not found']
      });
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        errors: ['Current password is incorrect']
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password change failed',
      errors: ['Internal server error']
    });
  }
};

// Create admin user
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password, role = 'admin' } = req.body;
    const createdBy = req.user._id;

    // Check if user already exists
    const existingUser = await User.findByEmailOrUsername(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username',
        errors: ['User already exists']
      });
    }

    // Create admin user
    const user = new User({
      username,
      email,
      password,
      role,
      createdBy,
      emailVerified: true // Admin users are pre-verified
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add refresh token to user
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        user: user.getPublicProfile(),
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin creation failed',
      errors: ['Internal server error']
    });
  }
};

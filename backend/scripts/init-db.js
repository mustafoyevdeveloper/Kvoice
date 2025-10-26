import mongoose from 'mongoose';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movimedia');
    console.log('📦 MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create default admin
    const admin = new User({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@moviemedia.org',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      },
      emailVerified: true
    });

    await admin.save();
    console.log('✅ Default admin user created');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123456'}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const createDefaultSettings = async () => {
  try {
    // Check if settings already exist
    const existingSettings = await Settings.findOne();
    if (existingSettings) {
      console.log('✅ Settings already exist');
      return;
    }

    // Create default settings
    const settings = new Settings();
    await settings.save();
    console.log('✅ Default settings created');
  } catch (error) {
    console.error('Error creating settings:', error);
  }
};

const initDatabase = async () => {
  try {
    await connectDB();
    await createDefaultAdmin();
    await createDefaultSettings();
    console.log('🎉 Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();

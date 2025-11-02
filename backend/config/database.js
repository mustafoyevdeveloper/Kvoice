import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MongoDB connection error: MONGODB_URI is not defined in .env file');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoURI.split('/').pop()}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;


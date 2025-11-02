import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MongoDB connection error: MONGODB_URI is not defined in .env file');
      console.error('💡 Please set MONGODB_URI in your .env file');
      process.exit(1);
    }
    
    const dbName = mongoURI.split('/').pop()?.split('?')[0] || 'kvoice';
    
    console.log('🔄 Connecting to MongoDB...');
    
    // Connection options (Mongoose 8.x compatible)
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout (increased for debugging)
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 10000, // 10 seconds connection timeout
      maxPoolSize: 10,
      minPoolSize: 1,
    };
    
    await mongoose.connect(mongoURI, options);
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${dbName}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Check if MongoDB is running');
    console.error('   2. Verify MONGODB_URI in .env file');
    console.error('   3. For local MongoDB: mongodb://localhost:27017/kvoice');
    console.error('   4. For MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/kvoice');
    console.error('');
    console.error('📖 See backend/MONGODB_SETUP.md for detailed setup instructions');
    process.exit(1);
  }
};

export default connectDB;


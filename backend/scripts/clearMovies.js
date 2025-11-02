import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/Movie.js';

// Load environment variables
dotenv.config();

const clearMovies = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });
    console.log('✅ MongoDB connected successfully');

    // Count existing movies before deletion
    const countBefore = await Movie.countDocuments();
    console.log(`\n📊 Found ${countBefore} movies and series in database`);

    if (countBefore === 0) {
      console.log('✅ Database is already empty. Nothing to delete.');
      process.exit(0);
    }

    // Delete all movies and series
    console.log('\n🗑️  Deleting all movies and series...');
    const result = await Movie.deleteMany({});
    console.log(`✅ Successfully deleted ${result.deletedCount} movies and series!`);

    // Verify deletion
    const countAfter = await Movie.countDocuments();
    console.log(`\n📊 Movies and series remaining: ${countAfter}`);

    if (countAfter === 0) {
      console.log('✅ Database cleared successfully!');
    } else {
      console.log('⚠️  Some movies/series may still exist.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing movies:', error);
    process.exit(1);
  }
};

clearMovies();


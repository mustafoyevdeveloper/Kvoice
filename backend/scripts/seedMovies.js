import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/Movie.js';

// Load environment variables
dotenv.config();

const movies = [
  // 4 ta kino

];

const seedMovies = async () => {
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

    // Clear existing movies (optional - comment out if you want to keep existing)
    // await Movie.deleteMany({});
    // console.log('🗑️  Cleared existing movies');

    // Insert movies one by one to avoid bulk write issues
    console.log('📝 Inserting movies...');
    const inserted = [];
    
    for (let i = 0; i < movies.length; i++) {
      try {
        const movie = movies[i];
        const newMovie = new Movie(movie);
        await newMovie.save();
        inserted.push(newMovie);
        console.log(`✅ ${i + 1}/${movies.length}: ${movie.category === 'series' ? '📺' : '🎬'} ${movie.title} inserted`);
      } catch (error) {
        console.error(`❌ Error inserting ${movies[i].title}:`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully inserted ${inserted.length}/${movies.length} movies and series!`);
    
    // Show inserted items
    console.log('\n📋 Inserted items:');
    inserted.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.category === 'series' ? '📺' : '🎬'} ${movie.title} (${movie.year}) - ${movie.category}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding movies:', error);
    process.exit(1);
  }
};

seedMovies();


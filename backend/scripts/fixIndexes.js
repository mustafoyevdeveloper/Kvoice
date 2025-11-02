import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixIndexes = async () => {
  try {
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
    });
    console.log('✅ MongoDB connected successfully');

    // Get the movies collection
    const db = mongoose.connection.db;
    const collection = db.collection('movies');

    // List existing indexes
    console.log('\n📋 Existing indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    // Drop text index if exists
    try {
      await collection.dropIndex('title_text_description_text');
      console.log('\n✅ Dropped text index: title_text_description_text');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n⚠️  Text index does not exist, skipping...');
      } else {
        throw error;
      }
    }

    // Create regular indexes (not text indexes)
    console.log('\n📝 Creating indexes...');
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ year: -1 });
    await collection.createIndex({ rating: -1 });
    await collection.createIndex({ views: -1 });
    await collection.createIndex({ isActive: 1 });
    await collection.createIndex({ genres: 1 });
    await collection.createIndex({ language: 1 });
    console.log('✅ Indexes created successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
};

fixIndexes();


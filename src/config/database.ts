import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('⚠️ MONGODB_URI is not set in environment variables');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('🍃 Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
  }
};


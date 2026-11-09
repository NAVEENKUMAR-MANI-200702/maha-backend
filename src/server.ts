import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
import { initFirebase } from './config/firebase';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Basic middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    service: 'maha-backend',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Maha Dairy Products Backend API',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth/me',
      products: '/api/v1/products',
    },
    status: 'active',
  });
});

// Start listening after connecting to database & Firebase
const startServer = async () => {
  // 1. Connect to MongoDB Atlas
  await connectDatabase();

  // 2. Initialize Firebase Admin SDK
  initFirebase();

  // 3. Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 Maha Backend is running on http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth API:     http://localhost:${PORT}/api/v1/auth/me`);
    console.log(`🥛 Products API: http://localhost:${PORT}/api/v1/products`);
  });
};

startServer();

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Basic middleware
app.use(cors());
app.use(express.json());

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
    status: 'active',
  });
});

// Start listening after connecting to database
const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Maha Backend is running on http://localhost:${PORT}`);
    console.log(`🩺 Health check available at http://localhost:${PORT}/health`);
  });
};

startServer();

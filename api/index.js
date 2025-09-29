// Imports
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

// Load env variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Init Express
const app = express();
const __dirname = path.resolve();

// ✅ CORS Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://mern-auth-silk.vercel.app'], // frontend URL-laringiz
    credentials: true,
  })
);

// Middleware
app.use(express.json()); // JSON parse qilish
app.use(cookieParser()); // Cookie parse qilish

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Static build folder (Vite uchun build qilingan frontend)
app.use(express.static(path.join(__dirname, '/client/dist')));

// Fallback route - frontend routingni qo‘llab-quvvatlash
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

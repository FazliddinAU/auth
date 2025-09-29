import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://auth-lac-seven.vercel.app', 'https://auth-i9ub906h7-fazliddinaus-projects.vercel.app'];

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin like mobile apps, Postman, curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Handle preflight requests for all routes
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// API routes first
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Serve static files from client dist
app.use(express.static(path.join(__dirname, '/client/dist')));

// SPA fallback — send index.html for any other route (client side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err); // Log error for debugging
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

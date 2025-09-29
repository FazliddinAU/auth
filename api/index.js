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

const app = express();

// MongoDB ulanishi
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('✅ MongoDB ulanishi muvaffaqiyatli');
  })
  .catch((err) => {
    console.error('❌ MongoDB ulanishida xatolik:', err);
  });

// CORS konfiguratsiyasi — **barcha domenlarga ruxsat**
app.use(cors({
  origin: '*',           // **Hamma domenlarga ruxsat**
  credentials: false,    // credentials true bo'lsa origin '*' bilan ishlamaydi
}));

// Preflight so‘rovlar uchun ham ruxsat
app.options('*', cors());

// Middlewares
app.use(express.json());
app.use(cookieParser());

// API yo‘llari
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Client build fayllarini server qilish (agar kerak bo‘lsa)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// SPA fallback (client-side routing uchun)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Global xatolik handler
app.use((err, req, res, next) => {
  console.error('❌ Server xatosi:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Ichki server xatosi',
  });
});

// Serverni ishga tushurish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishga tushdi`);
});

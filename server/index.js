const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Thêm các routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const statisticsRoutes = require('./routes/statistics');
const userRoutes = require('./routes/users');
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

let server;

// Kết nối MongoDB và khởi chạy server
const startServer = async () => {
  try {
    // Kết nối MongoDB
    await connectDB();
    console.log('MongoDB connected successfully');

    // Khởi tạo routes
    app.use('/api/auth', authRoutes);
    app.use('/api/students', studentRoutes);
    app.use('/api/statistics', statisticsRoutes);
    app.use('/api/users', userRoutes);

    // Xử lý lỗi
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({ 
        message: 'Có lỗi xảy ra!',
        error: err.message 
      });
    });

    const PORT = process.env.PORT || 3000;
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Xử lý tắt server
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }
});

startServer();


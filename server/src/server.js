// BME/server/src/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import routes
const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const entriesRoutes = require('./routes/entries');
const attendanceRoutes = require('./routes/attendance');
const salaryRoutes = require('./routes/salary');
const creditorsRoutes = require('./routes/creditors');
const inventoryRoutes = require('./routes/inventory');
const indentRoutes = require('./routes/indent');
const savingsRoutes = require('./routes/savings');
const bankRoutes = require('./routes/bank');
const pigmyRoutes = require('./routes/pigmy');
const maintenanceRoutes = require('./routes/maintenance');
const usersRoutes = require('./routes/users');
const logsRoutes = require('./routes/logs');

// Initialize express app
const app = express();

// Middleware
// Configure CORS: permissive during development to avoid CORS errors from Next dev
const corsOptions = (process.env.NODE_ENV === 'development')
  ? { origin: true, credentials: true }
  : { origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/entries', entriesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/creditors', creditorsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/indent', indentRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/pigmy', pigmyRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/logs', logsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Accounts Management System API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Accounts Management System API`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔌 Port: ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`\n❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`\n❌ Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});
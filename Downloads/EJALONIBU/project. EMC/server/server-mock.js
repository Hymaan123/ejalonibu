const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock database simulation
console.log('Mock database connected successfully');
console.log('Mock database models synchronized');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'Mock database (in-memory)'
  });
});

// Root route handler for development
app.get('/', (req, res) => {
  res.json({
    message: 'EMC Ejalonibu Metal and Aluminium Works API Server (Mock Mode)',
    status: 'Running',
    environment: process.env.NODE_ENV || 'development',
    note: 'This is a mock server for frontend development',
    endpoints: {
      health: '/api/health',
      'auth (mock)': '/api/auth/*',
      'users (mock)': '/api/users/*',
      'enquiries (mock)': '/api/enquiries/*',
      'projects (mock)': '/api/projects/*',
      'admin (mock)': '/api/admin/*',
      'services (mock)': '/api/services/*',
      'quotes (mock)': '/api/quotes/*'
    }
  });
});

// Mock API routes for frontend testing
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Welding Services', description: 'Professional welding for all metal types', price: 100 },
      { id: 2, name: 'Metal Fabrication', description: 'Custom metal fabrication services', price: 200 },
      { id: 3, name: 'Repair Services', description: 'Metal repair and restoration', price: 150 }
    ]
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Mock login successful',
    data: {
      token: 'mock_jwt_token_12345',
      user: {
        id: 1,
        name: 'Test User',
        email: req.body.email || 'test@example.com',
        role: 'customer'
      }
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Mock registration successful',
    data: {
      token: 'mock_jwt_token_12345',
      user: {
        id: 1,
        name: req.body.name || 'New User',
        email: req.body.email || 'new@example.com',
        role: 'customer'
      }
    }
  });
});

app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Sample Project 1', status: 'in-progress', progress: 50 },
      { id: 2, name: 'Sample Project 2', status: 'completed', progress: 100 }
    ]
  });
});

app.get('/api/enquiries', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, subject: 'Quote Request', status: 'pending', date: new Date() },
      { id: 2, subject: 'Service Inquiry', status: 'responded', date: new Date() }
    ]
  });
});

// Catch-all for API routes
app.all('/api/*', (req, res) => {
  res.json({
    success: true,
    message: `Mock API endpoint: ${req.method} ${req.path}`,
    data: { mock: true, method: req.method, path: req.path }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 EMC Ejalonibu Metal and Aluminium Works Mock Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  console.log(`💡 This is a mock server for frontend development`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/`);
});

module.exports = app;
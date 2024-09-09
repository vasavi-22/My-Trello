import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './src/config/index.js';
import userRoutes from './src/routes/user.route.js';
import taskRoutes from './src/routes/task.route.js';

// Get directory name for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const corsOptions = {
  origin: 'https://my-trello-frontend-gray.vercel.app', // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
  credentials: true, // Allow cookies and credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://my-trello-frontend-gray.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Handle preflight request
  }
  next();
});

// Session configuration
app.use(session({
  secret: 'mySuperSecretKey123456!',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set secure to true in production with HTTPS
}));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route handlers
app.use('/user', userRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Connect to MongoDB and start server
(async () => {
  try {
    await mongoose.connect(config.DATABASE);
    console.log('MongoDB connected');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
})();

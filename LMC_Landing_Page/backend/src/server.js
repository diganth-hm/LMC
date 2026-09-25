import express from 'express';
import session from 'express-session';
import cors from 'cors';
import config from './config/index.js';
import passport from './services/passport.js';
import authRoutes from './routes/auth.js';
import analyticsRoutes from './routes/analytics.js';

const app = express();

// Trust proxy in production / standard environments
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if running over HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LastMile Carbon Backend',
    timestamp: new Date().toISOString()
  });
});

app.listen(config.port, () => {
  console.log(`[LastMile Carbon Backend] Server listening on port ${config.port}`);
});

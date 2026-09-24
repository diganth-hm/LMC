import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import riderRoutes from './routes/rider.routes';
import deliveriesRoutes from './routes/deliveries.routes';
import routesRoutes from './routes/routes.routes';
import co2Routes from './routes/co2.routes';
import walletRoutes from './routes/wallet.routes';
import platformRoutes from './routes/platform.routes';
import analyticsRoutes from './routes/analytics.routes';
import creditsRoutes from './routes/credits.routes';
import verificationRoutes from './routes/verification.routes';
import buyerRoutes from './routes/buyer.routes';
import purchasesRoutes from './routes/purchases.routes';
import certificatesRoutes from './routes/certificates.routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in hackathon/dev mode to prevent CORS blocks
      }
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    data: null,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later.' },
  },
});
app.use(limiter);

// Body parser
app.use(express.json());

// Healthcheck
const handleHealth = (_req: express.Request, res: express.Response) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
};
app.get('/health', handleHealth);
app.get('/api/health', handleHealth);

// Route registration helper
const mountRoutes = (prefix: string) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/riders`, riderRoutes);
  app.use(`${prefix}/deliveries`, deliveriesRoutes);
  app.use(`${prefix}/routes`, routesRoutes);
  app.use(`${prefix}/co2`, co2Routes);
  app.use(`${prefix}/wallet`, walletRoutes);
  app.use(`${prefix}/platform`, platformRoutes);
  app.use(`${prefix}/analytics`, analyticsRoutes);
  app.use(`${prefix}/credits`, creditsRoutes);
  app.use(`${prefix}/credits`, verificationRoutes);
  app.use(`${prefix}/buyer`, buyerRoutes);
  app.use(`${prefix}/purchases`, purchasesRoutes);
  app.use(`${prefix}/certificates`, certificatesRoutes);
};

// Mount under both root / and /api for compatibility with all frontend blueprints
mountRoutes('');
mountRoutes('/api');

// Central error handler
app.use(errorHandler);

export default app;

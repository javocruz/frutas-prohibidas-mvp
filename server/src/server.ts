import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import usersRouter from './routes/users';
import rewardsRouter from './routes/rewards';
import receiptsRouter from './routes/receipts';
import metricsRouter from './routes/metrics';
import menuItemsRouter from './routes/menuItems';

const app = express();

// Security middleware with CSP configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5174", "ws://localhost:5174"],
    },
  },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true,
}));

// More flexible rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // For local development, allow a much higher limit to avoid issues with hot-reloading
    if (req.ip === '::1' || req.ip === '127.0.0.1' || req.ip.startsWith('::ffff:127.0.0.1')) {
      return 1000;
    }
    // For production, keep a reasonable limit
    return 100;
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use('/api', apiLimiter);

// Body parsing
app.use(express.json());

// API routes
app.use('/api/users', usersRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/receipts', receiptsRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/menu-items', menuItemsRouter);

// Error handling
app.use(errorHandler);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
}); 
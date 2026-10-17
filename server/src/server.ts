import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import generateRoute from './routes/generate.js';
import statusRoute from './routes/status.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createServer = (): Express => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json({ limit: '1mb' }));

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'ListingLab API',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/status', statusRoute);
  app.use('/api/generate', generateRoute);

  // Serve production client static assets if available
  const clientDistFromCwd = path.resolve(process.cwd(), 'client/dist');
  const clientDistFromDirname = path.resolve(__dirname, '../../client/dist');
  const clientDistPath = fs.existsSync(clientDistFromCwd)
    ? clientDistFromCwd
    : clientDistFromDirname;

  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));

    // Handle React SPA client-side routing fallback without intercepting API routes
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  // 404 handler for unmatched /api routes
  app.all('/api/*', (_req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'API endpoint not found',
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

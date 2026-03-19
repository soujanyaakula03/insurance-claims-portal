import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import { claimsRouter } from './routes/claims.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'claims-service', timestamp: new Date().toISOString() });
});

// Routes
app.use('/claims', claimsRouter);

// Error handler
app.use(errorHandler);

export default app;

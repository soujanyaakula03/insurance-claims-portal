import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import { authRouter } from './routes/auth.routes';
import { usersRouter } from './routes/users.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'users-service', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);

// Error handler (must be last)
app.use(errorHandler);

export default app;

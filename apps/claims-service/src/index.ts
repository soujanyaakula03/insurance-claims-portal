import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { db } from './db';
import { redisClient } from './cache';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  try {
    await db.query('SELECT 1');
    logger.info('Database connection established');

    await redisClient.connect();
    logger.info('Redis connection established');

    app.listen(PORT, () => {
      logger.info(`Claims service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start claims service');
    process.exit(1);
  }
}

bootstrap();

import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { db } from './db';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3002;

async function bootstrap() {
  try {
    // Verify database connection
    await db.query('SELECT 1');
    logger.info('Database connection established');

    app.listen(PORT, () => {
      logger.info(`Users service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start users service');
    process.exit(1);
  }
}

bootstrap();

import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    const app = await createApp();
    app.listen(PORT, () => {
      logger.info(`API Gateway running on port ${PORT}`);
      logger.info(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start API Gateway');
    process.exit(1);
  }
}

bootstrap();

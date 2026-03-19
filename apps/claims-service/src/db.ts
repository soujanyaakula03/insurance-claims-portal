import { Pool } from 'pg';
import { logger } from './utils/logger';

export const db = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'claims_db',
  max: 10,
  idleTimeoutMillis: 30000,
});

db.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle PostgreSQL client');
});

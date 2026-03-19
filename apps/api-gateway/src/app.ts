import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { authenticate } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';
import { claimsRouter } from './routes/claims.routes';
import { usersRouter } from './routes/users.routes';
import { logger } from './utils/logger';

export async function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  // Health check (public)
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() });
  });

  // Public auth routes (proxy to users-service)
  app.use('/api/auth', usersRouter);

  // Protected REST routes
  app.use('/api/claims', authenticate, claimsRouter);
  app.use('/api/users', authenticate, usersRouter);

  // GraphQL endpoint (protected)
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();

  app.use(
    '/graphql',
    express.json(),
    authenticate,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ user: req.user }),
    })
  );

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

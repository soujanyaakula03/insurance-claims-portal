import { Router } from 'express';
import {
  listClaimsHandler,
  getClaimHandler,
  createClaimHandler,
  updateClaimHandler,
  deleteClaimHandler,
  getDashboardSummaryHandler,
} from '../controllers/claims.controller';
import { requireRole } from '../middleware/auth.middleware';

export const claimsRouter = Router();

// Dashboard summary (cached)
claimsRouter.get('/summary', getDashboardSummaryHandler);

// CRUD
claimsRouter.get('/', listClaimsHandler);
claimsRouter.get('/:id', getClaimHandler);
claimsRouter.post('/', requireRole(['admin', 'adjuster']), createClaimHandler);
claimsRouter.patch('/:id', requireRole(['admin', 'adjuster']), updateClaimHandler);
claimsRouter.delete('/:id', requireRole(['admin']), deleteClaimHandler);

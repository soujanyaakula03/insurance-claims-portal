import { Request, Response } from 'express';
import * as claimsService from '../services/claims.service';
import {
  createClaimSchema,
  updateClaimSchema,
  listClaimsQuerySchema,
} from '../validators/claims.validator';

export async function listClaimsHandler(req: Request, res: Response): Promise<void> {
  const query = listClaimsQuerySchema.parse(req.query);
  const result = await claimsService.listClaims(query);
  res.json({ success: true, data: result });
}

export async function getClaimHandler(req: Request, res: Response): Promise<void> {
  const claim = await claimsService.getClaimById(req.params.id);
  res.json({ success: true, data: claim });
}

export async function createClaimHandler(req: Request, res: Response): Promise<void> {
  const input = createClaimSchema.parse(req.body);
  const userId = req.headers['x-user-id'] as string | undefined;
  const claim = await claimsService.createClaim(input, userId);
  res.status(201).json({ success: true, data: claim });
}

export async function updateClaimHandler(req: Request, res: Response): Promise<void> {
  const input = updateClaimSchema.parse(req.body);
  const claim = await claimsService.updateClaim(req.params.id, input);
  res.json({ success: true, data: claim });
}

export async function deleteClaimHandler(req: Request, res: Response): Promise<void> {
  await claimsService.deleteClaim(req.params.id);
  res.status(204).send();
}

export async function getDashboardSummaryHandler(_req: Request, res: Response): Promise<void> {
  const summary = await claimsService.getDashboardSummary();
  res.json({ success: true, data: summary });
}

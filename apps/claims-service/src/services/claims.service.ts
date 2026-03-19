import * as claimsRepo from '../repositories/claims.repository';
import { getFromCache, setCache, invalidateCache } from '../cache';
import type { CreateClaimInput, UpdateClaimInput, ListClaimsQuery } from '../validators/claims.validator';
import type { Claim, PaginatedResponse } from '../types';

function mapRow(row: claimsRepo.ClaimRow): Claim {
  return {
    id: row.id,
    claimNumber: row.claim_number,
    title: row.title,
    description: row.description || undefined,
    type: row.type as Claim['type'],
    status: row.status as Claim['status'],
    amountClaimed: parseFloat(row.amount_claimed),
    amountApproved: row.amount_approved ? parseFloat(row.amount_approved) : undefined,
    policyNumber: row.policy_number,
    claimantName: row.claimant_name,
    claimantEmail: row.claimant_email,
    claimantPhone: row.claimant_phone || undefined,
    incidentDate: typeof row.incident_date === 'string' ? row.incident_date : new Date(row.incident_date).toISOString().split('T')[0],
    submittedBy: row.submitted_by || undefined,
    assignedTo: row.assigned_to || undefined,
    reviewedAt: row.reviewed_at?.toISOString(),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listClaims(query: ListClaimsQuery): Promise<PaginatedResponse<Claim>> {
  const cacheKey = `claims:list:${JSON.stringify(query)}`;
  const cached = await getFromCache<PaginatedResponse<Claim>>(cacheKey);
  if (cached) return cached;

  const { rows, total } = await claimsRepo.findAllClaims(query);
  const result: PaginatedResponse<Claim> = {
    data: rows.map(mapRow),
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
  };

  await setCache(cacheKey, result);
  return result;
}

export async function getClaimById(id: string): Promise<Claim> {
  const cacheKey = `claims:detail:${id}`;
  const cached = await getFromCache<Claim>(cacheKey);
  if (cached) return cached;

  const row = await claimsRepo.findClaimById(id);
  if (!row) {
    throw Object.assign(new Error('Claim not found'), { statusCode: 404 });
  }

  const claim = mapRow(row);
  await setCache(cacheKey, claim);
  return claim;
}

export async function createClaim(input: CreateClaimInput, userId?: string): Promise<Claim> {
  const row = await claimsRepo.insertClaim(input, userId);
  await invalidateCache('claims:list:*');
  await invalidateCache('claims:summary:*');
  return mapRow(row);
}

export async function updateClaim(id: string, input: UpdateClaimInput): Promise<Claim> {
  const existing = await claimsRepo.findClaimById(id);
  if (!existing) {
    throw Object.assign(new Error('Claim not found'), { statusCode: 404 });
  }

  const row = await claimsRepo.updateClaimById(id, input);
  if (!row) {
    throw Object.assign(new Error('Claim not found'), { statusCode: 404 });
  }

  await invalidateCache(`claims:detail:${id}`);
  await invalidateCache('claims:list:*');
  await invalidateCache('claims:summary:*');
  return mapRow(row);
}

export async function deleteClaim(id: string): Promise<void> {
  const exists = await claimsRepo.findClaimById(id);
  if (!exists) {
    throw Object.assign(new Error('Claim not found'), { statusCode: 404 });
  }

  await claimsRepo.deleteClaimById(id);
  await invalidateCache(`claims:detail:${id}`);
  await invalidateCache('claims:list:*');
  await invalidateCache('claims:summary:*');
}

export async function getDashboardSummary() {
  const cacheKey = 'claims:summary:dashboard';
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const rows = await claimsRepo.getClaimsSummary();

  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  let totalClaims = 0;
  let totalAmountClaimed = 0;
  let totalAmountApproved = 0;

  for (const row of rows) {
    const count = parseInt(row.count, 10);
    byStatus[row.status] = (byStatus[row.status] || 0) + count;
    byType[row.type] = (byType[row.type] || 0) + count;
    totalClaims += count;
    totalAmountClaimed += parseFloat(row.total_claimed || '0');
    totalAmountApproved += parseFloat(row.total_approved || '0');
  }

  const summary = { totalClaims, byStatus, byType, totalAmountClaimed, totalAmountApproved };
  await setCache(cacheKey, summary);
  return summary;
}

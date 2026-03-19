import { db } from '../db';
import type { CreateClaimInput, UpdateClaimInput, ListClaimsQuery } from '../validators/claims.validator';

export interface ClaimRow {
  id: string;
  claim_number: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  amount_claimed: string;
  amount_approved: string | null;
  policy_number: string;
  claimant_name: string;
  claimant_email: string;
  claimant_phone: string | null;
  incident_date: string;
  submitted_by: string | null;
  assigned_to: string | null;
  reviewed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

function generateClaimNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  const seq = Date.now().toString().slice(-4);
  return `CLM-${year}-${random}${seq}`.slice(0, 20);
}

export async function findAllClaims(query: ListClaimsQuery): Promise<{ rows: ClaimRow[]; total: number }> {
  const { page, limit, status, type } = query;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }
  if (type) {
    conditions.push(`type = $${paramIndex++}`);
    params.push(type);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query<{ count: string }>(
    `SELECT COUNT(*) FROM claims ${where}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const dataResult = await db.query<ClaimRow>(
    `SELECT * FROM claims ${where} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    [...params, limit, offset]
  );

  return { rows: dataResult.rows, total };
}

export async function findClaimById(id: string): Promise<ClaimRow | null> {
  const result = await db.query<ClaimRow>('SELECT * FROM claims WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function insertClaim(data: CreateClaimInput, submittedBy?: string): Promise<ClaimRow> {
  const claimNumber = generateClaimNumber();
  const result = await db.query<ClaimRow>(
    `INSERT INTO claims (
      claim_number, title, description, type, status, amount_claimed,
      policy_number, claimant_name, claimant_email, claimant_phone,
      incident_date, submitted_by
    ) VALUES ($1,$2,$3,$4,'submitted',$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`,
    [
      claimNumber, data.title, data.description || null, data.type,
      data.amountClaimed, data.policyNumber, data.claimantName,
      data.claimantEmail, data.claimantPhone || null, data.incidentDate,
      submittedBy || null,
    ]
  );
  return result.rows[0];
}

export async function updateClaimById(id: string, data: UpdateClaimInput): Promise<ClaimRow | null> {
  const sets: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (data.title !== undefined) { sets.push(`title = $${idx++}`); params.push(data.title); }
  if (data.description !== undefined) { sets.push(`description = $${idx++}`); params.push(data.description); }
  if (data.status !== undefined) {
    sets.push(`status = $${idx++}`); params.push(data.status);
    if (data.status === 'approved' || data.status === 'rejected') {
      sets.push(`reviewed_at = $${idx++}`); params.push(new Date().toISOString());
    }
  }
  if (data.amountApproved !== undefined) { sets.push(`amount_approved = $${idx++}`); params.push(data.amountApproved); }
  if (data.assignedTo !== undefined) { sets.push(`assigned_to = $${idx++}`); params.push(data.assignedTo); }

  if (sets.length === 0) return findClaimById(id);

  params.push(id);
  const result = await db.query<ClaimRow>(
    `UPDATE claims SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
    params
  );
  return result.rows[0] || null;
}

export async function deleteClaimById(id: string): Promise<boolean> {
  const result = await db.query('DELETE FROM claims WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function getClaimsSummary() {
  const result = await db.query<{
    status: string;
    type: string;
    count: string;
    total_claimed: string;
    total_approved: string;
  }>(`
    SELECT
      status,
      type,
      COUNT(*) as count,
      SUM(amount_claimed) as total_claimed,
      COALESCE(SUM(amount_approved), 0) as total_approved
    FROM claims
    GROUP BY status, type
  `);
  return result.rows;
}

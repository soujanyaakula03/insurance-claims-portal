import { z } from 'zod';

export const createClaimSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  type: z.enum(['auto', 'home', 'health', 'life', 'liability']),
  amountClaimed: z.number().positive('Amount must be positive'),
  policyNumber: z.string().min(1).max(50),
  claimantName: z.string().min(1).max(200),
  claimantEmail: z.string().email(),
  claimantPhone: z.string().optional(),
  incidentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

export const updateClaimSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'closed']).optional(),
  amountApproved: z.number().positive().optional(),
  assignedTo: z.string().uuid().optional().nullable(),
});

export const listClaimsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'closed']).optional(),
  type: z.enum(['auto', 'home', 'health', 'life', 'liability']).optional(),
});

export type CreateClaimInput = z.infer<typeof createClaimSchema>;
export type UpdateClaimInput = z.infer<typeof updateClaimSchema>;
export type ListClaimsQuery = z.infer<typeof listClaimsQuerySchema>;

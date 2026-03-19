import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock the repository so we test pure service logic
jest.mock('../repositories/claims.repository');
jest.mock('../cache', () => ({
  getFromCache: jest.fn().mockResolvedValue(null),
  setCache: jest.fn().mockResolvedValue(undefined),
  invalidateCache: jest.fn().mockResolvedValue(undefined),
}));

import * as claimsRepo from '../repositories/claims.repository';
import * as claimsService from '../services/claims.service';

const mockClaimRow = {
  id: 'abc-123',
  claim_number: 'CLM-2024-0001',
  title: 'Test claim',
  description: 'A test',
  type: 'auto',
  status: 'submitted',
  amount_claimed: '5000.00',
  amount_approved: null,
  policy_number: 'POL-001',
  claimant_name: 'John Doe',
  claimant_email: 'john@test.com',
  claimant_phone: null,
  incident_date: '2024-01-01',
  submitted_by: null,
  assigned_to: null,
  reviewed_at: null,
  created_at: new Date('2024-01-02T00:00:00Z'),
  updated_at: new Date('2024-01-02T00:00:00Z'),
};

describe('claimsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getClaimById', () => {
    it('returns a mapped claim when found', async () => {
      (claimsRepo.findClaimById as jest.Mock).mockResolvedValue(mockClaimRow);
      const result = await claimsService.getClaimById('abc-123');
      expect(result.id).toBe('abc-123');
      expect(result.claimNumber).toBe('CLM-2024-0001');
      expect(result.amountClaimed).toBe(5000);
      expect(result.status).toBe('submitted');
    });

    it('throws 404 error when claim not found', async () => {
      (claimsRepo.findClaimById as jest.Mock).mockResolvedValue(null);
      await expect(claimsService.getClaimById('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Claim not found',
      });
    });
  });

  describe('createClaim', () => {
    it('creates a claim and returns mapped result', async () => {
      (claimsRepo.insertClaim as jest.Mock).mockResolvedValue({
        ...mockClaimRow,
        id: 'new-id',
        claim_number: 'CLM-2024-9999',
      });

      const result = await claimsService.createClaim({
        title: 'Test claim',
        type: 'auto',
        amountClaimed: 5000,
        policyNumber: 'POL-001',
        claimantName: 'John Doe',
        claimantEmail: 'john@test.com',
        incidentDate: '2024-01-01',
      });

      expect(result.id).toBe('new-id');
      expect(result.claimNumber).toBe('CLM-2024-9999');
    });
  });

  describe('updateClaim', () => {
    it('throws 404 if claim does not exist', async () => {
      (claimsRepo.findClaimById as jest.Mock).mockResolvedValue(null);
      await expect(claimsService.updateClaim('ghost-id', { status: 'approved' })).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('updates the claim status successfully', async () => {
      (claimsRepo.findClaimById as jest.Mock).mockResolvedValue(mockClaimRow);
      (claimsRepo.updateClaimById as jest.Mock).mockResolvedValue({
        ...mockClaimRow,
        status: 'approved',
        amount_approved: '4500.00',
      });

      const result = await claimsService.updateClaim('abc-123', {
        status: 'approved',
        amountApproved: 4500,
      });

      expect(result.status).toBe('approved');
      expect(result.amountApproved).toBe(4500);
    });
  });

  describe('deleteClaim', () => {
    it('throws 404 if claim not found', async () => {
      (claimsRepo.findClaimById as jest.Mock).mockResolvedValue(null);
      await expect(claimsService.deleteClaim('ghost')).rejects.toMatchObject({ statusCode: 404 });
    });

    it('deletes successfully when claim exists', async () => {
      (claimsRepo.findClaimById as jest.Mock).mockResolvedValue(mockClaimRow);
      (claimsRepo.deleteClaimById as jest.Mock).mockResolvedValue(true);
      await expect(claimsService.deleteClaim('abc-123')).resolves.toBeUndefined();
    });
  });
});

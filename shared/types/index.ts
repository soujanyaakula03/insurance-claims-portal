// Shared TypeScript types across all services

export type UserRole = 'admin' | 'adjuster' | 'viewer';

export type ClaimStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'closed';

export type ClaimType = 'auto' | 'home' | 'health' | 'life' | 'liability';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  title: string;
  description?: string;
  type: ClaimType;
  status: ClaimStatus;
  amountClaimed: number;
  amountApproved?: number;
  policyNumber: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone?: string;
  incidentDate: string;
  submittedBy?: string;
  assignedTo?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface DashboardSummary {
  totalClaims: number;
  byStatus: Record<ClaimStatus, number>;
  byType: Record<ClaimType, number>;
  totalAmountClaimed: number;
  totalAmountApproved: number;
  recentClaims: Claim[];
}

import apiClient from '../lib/apiClient';
import type { Claim, PaginatedResponse, User } from '../types';

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<{ success: boolean; data: LoginResponse }>('/auth/login', {
    email,
    password,
  });
  return data.data;
}

// ─── Claims ──────────────────────────────────────────────────────────────────

export interface ListClaimsParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

export async function fetchClaims(params: ListClaimsParams = {}): Promise<PaginatedResponse<Claim>> {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResponse<Claim> }>(
    '/claims',
    { params }
  );
  return data.data;
}

export async function fetchClaimById(id: string): Promise<Claim> {
  const { data } = await apiClient.get<{ success: boolean; data: Claim }>(`/claims/${id}`);
  return data.data;
}

export interface CreateClaimPayload {
  title: string;
  description?: string;
  type: string;
  amountClaimed: number;
  policyNumber: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone?: string;
  incidentDate: string;
}

export async function createClaim(payload: CreateClaimPayload): Promise<Claim> {
  const { data } = await apiClient.post<{ success: boolean; data: Claim }>('/claims', payload);
  return data.data;
}

export interface UpdateClaimPayload {
  status?: string;
  amountApproved?: number;
  assignedTo?: string | null;
  title?: string;
  description?: string;
}

export async function updateClaim(id: string, payload: UpdateClaimPayload): Promise<Claim> {
  const { data } = await apiClient.patch<{ success: boolean; data: Claim }>(
    `/claims/${id}`,
    payload
  );
  return data.data;
}

export async function deleteClaim(id: string): Promise<void> {
  await apiClient.delete(`/claims/${id}`);
}

// ─── Dashboard (GraphQL) ─────────────────────────────────────────────────────

const DASHBOARD_QUERY = `
  query DashboardSummary {
    dashboardSummary {
      totalClaims
      totalAmountClaimed
      totalAmountApproved
      byStatus { status count }
      byType { type count }
    }
  }
`;

export interface DashboardData {
  totalClaims: number;
  totalAmountClaimed: number;
  totalAmountApproved: number;
  byStatus: { status: string; count: number }[];
  byType: { type: string; count: number }[];
}

export async function fetchDashboardSummary(): Promise<DashboardData> {
  const token = localStorage.getItem('auth_token');
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query: DASHBOARD_QUERY }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');
  return json.data.dashboardSummary as DashboardData;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import type { ListClaimsParams, UpdateClaimPayload, CreateClaimPayload } from '../api';

export const QUERY_KEYS = {
  claims: (params: ListClaimsParams) => ['claims', params] as const,
  claim: (id: string) => ['claim', id] as const,
  dashboard: ['dashboard'] as const,
};

export function useClaims(params: ListClaimsParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.claims(params),
    queryFn: () => api.fetchClaims(params),
  });
}

export function useClaim(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.claim(id),
    queryFn: () => api.fetchClaimById(id),
    enabled: !!id,
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: api.fetchDashboardSummary,
  });
}

export function useCreateClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClaimPayload) => api.createClaim(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['claims'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}

export function useUpdateClaim(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateClaimPayload) => api.updateClaim(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.claim(id) });
      qc.invalidateQueries({ queryKey: ['claims'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}

export function useDeleteClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteClaim(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['claims'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}

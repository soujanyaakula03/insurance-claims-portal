import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useClaim, useUpdateClaim, useDeleteClaim } from '../hooks/useQueries';
import { StatusBadge, TypeBadge } from '../components/ui/Badge';
import { LoadingScreen, ErrorState } from '../components/ui/States';
import { useAuth } from '../hooks/useAuthContext';
import { format } from 'date-fns';
import type { ClaimStatus, ClaimType } from '../types';
import { Spinner } from '../components/ui/States';

const STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['submitted'],
  submitted: ['under_review', 'rejected'],
  under_review: ['approved', 'rejected'],
  approved: ['closed'],
  rejected: [],
  closed: [],
};

export function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: claim, isLoading, isError } = useClaim(id!);
  const updateMutation = useUpdateClaim(id!);
  const deleteMutation = useDeleteClaim();
  const [newStatus, setNewStatus] = useState('');
  const [amountApproved, setAmountApproved] = useState('');

  if (isLoading) return <LoadingScreen message="Loading claim…" />;
  if (isError || !claim) return <ErrorState message="Claim not found." />;

  const nextStatuses = STATUS_TRANSITIONS[claim.status] ?? [];
  const canEdit = user?.role === 'admin' || user?.role === 'adjuster';
  const canDelete = user?.role === 'admin';

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    const payload: { status: string; amountApproved?: number } = { status: newStatus };
    if (newStatus === 'approved' && amountApproved) {
      payload.amountApproved = parseFloat(amountApproved);
    }
    await updateMutation.mutateAsync(payload);
    setNewStatus('');
    setAmountApproved('');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this claim? This action cannot be undone.')) return;
    await deleteMutation.mutateAsync(id!);
    navigate('/claims');
  };

  const field = (label: string, value: string | undefined | null) =>
    value ? (
      <div>
        <dt className="text-xs font-medium text-gray-500">{label}</dt>
        <dd className="mt-0.5 text-sm text-gray-900">{value}</dd>
      </div>
    ) : null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <Link to="/claims" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        ← Back to Claims
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-gray-500">{claim.claimNumber}</span>
            <StatusBadge status={claim.status as ClaimStatus} />
            <TypeBadge type={claim.type as ClaimType} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">{claim.title}</h1>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="btn-danger text-xs"
          >
            {deleteMutation.isPending ? <Spinner size="sm" /> : null}
            Delete Claim
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Claim details */}
          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Claim Information</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {field('Policy Number', claim.policyNumber)}
              {field('Incident Date', format(new Date(claim.incidentDate), 'MMMM d, yyyy'))}
              {field('Amount Claimed', `$${Number(claim.amountClaimed).toLocaleString()}`)}
              {field('Amount Approved', claim.amountApproved ? `$${Number(claim.amountApproved).toLocaleString()}` : '—')}
              {field('Filed On', format(new Date(claim.createdAt), 'MMM d, yyyy'))}
              {claim.reviewedAt && field('Reviewed At', format(new Date(claim.reviewedAt), 'MMM d, yyyy'))}
            </dl>
            {claim.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <dt className="text-xs font-medium text-gray-500 mb-1">Description</dt>
                <dd className="text-sm text-gray-700 leading-relaxed">{claim.description}</dd>
              </div>
            )}
          </div>

          {/* Claimant info */}
          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Claimant</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {field('Name', claim.claimantName)}
              {field('Email', claim.claimantEmail)}
              {field('Phone', claim.claimantPhone)}
            </dl>
          </div>
        </div>

        {/* Actions sidebar */}
        {canEdit && nextStatuses.length > 0 && (
          <div className="card p-5 self-start">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Update Status</h2>
            <div className="space-y-3">
              <div>
                <label className="form-label">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-input"
                  aria-label="Select new status"
                >
                  <option value="">Select…</option>
                  {nextStatuses.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              {newStatus === 'approved' && (
                <div>
                  <label className="form-label">Approved Amount ($)</label>
                  <input
                    type="number"
                    value={amountApproved}
                    onChange={(e) => setAmountApproved(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 5000"
                    min="0"
                  />
                </div>
              )}

              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus || updateMutation.isPending}
                className="btn-primary w-full justify-center"
              >
                {updateMutation.isPending ? <Spinner size="sm" /> : null}
                Update
              </button>

              {updateMutation.isError && (
                <p className="text-xs text-red-600">Update failed. Please try again.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

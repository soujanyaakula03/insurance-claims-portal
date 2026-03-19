import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClaims } from '../hooks/useQueries';
import { StatusBadge, TypeBadge } from '../components/ui/Badge';
import { LoadingScreen, ErrorState, EmptyState } from '../components/ui/States';
import { useAuth } from '../hooks/useAuthContext';
import type { ClaimStatus, ClaimType } from '../types';
import { format } from 'date-fns';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'closed', label: 'Closed' },
];

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'auto', label: 'Auto' },
  { value: 'home', label: 'Home' },
  { value: 'health', label: 'Health' },
  { value: 'life', label: 'Life' },
  { value: 'liability', label: 'Liability' },
];

export function ClaimsListPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useClaims({
    page,
    limit: 15,
    ...(status ? { status: status as ClaimStatus } : {}),
    ...(type ? { type: type as ClaimType } : {}),
  });

  const canCreate = user?.role === 'admin' || user?.role === 'adjuster';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
          {data && (
            <p className="mt-0.5 text-sm text-gray-500">{data.total} total claims</p>
          )}
        </div>
        {canCreate && (
          <Link to="/claims/new" className="btn-primary">
            + New Claim
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="form-input w-auto"
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="form-input w-auto"
          aria-label="Filter by type"
        >
          {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Table */}
      {isLoading && <LoadingScreen message="Loading claims…" />}
      {isError && <ErrorState message="Failed to load claims." />}
      {!isLoading && !isError && data?.data.length === 0 && (
        <EmptyState message="No claims match your filters." />
      )}
      {!isLoading && !isError && data && data.data.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Claim #', 'Title', 'Type', 'Status', 'Amount', 'Date', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.data.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{claim.claimNumber}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-gray-900 truncate">{claim.title}</p>
                      <p className="text-xs text-gray-400 truncate">{claim.claimantName}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <TypeBadge type={claim.type as ClaimType} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={claim.status as ClaimStatus} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                      ${Number(claim.amountClaimed).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {format(new Date(claim.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        to={`/claims/${claim.id}`}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-xs text-gray-500">
                Page {data.page} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

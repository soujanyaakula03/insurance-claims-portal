import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useQueries';
import { LoadingScreen, ErrorState } from '../components/ui/States';
import { useAuth } from '../hooks/useAuthContext';

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-200',
  submitted: 'bg-blue-200',
  under_review: 'bg-yellow-300',
  approved: 'bg-green-300',
  rejected: 'bg-red-300',
  closed: 'bg-gray-400',
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) return <LoadingScreen message="Loading dashboard…" />;
  if (isError || !data) return <ErrorState message="Failed to load dashboard data." />;

  const approvalRate = data.totalClaims > 0
    ? Math.round(((data.byStatus.find(s => s.status === 'approved')?.count ?? 0) / data.totalClaims) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Welcome back, {user?.firstName}. Here's today's snapshot.
          </p>
        </div>
        <Link to="/claims/new" className="btn-primary">
          + New Claim
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Claims" value={data.totalClaims} />
        <StatCard label="Total Claimed" value={formatCurrency(data.totalAmountClaimed)} />
        <StatCard label="Total Approved" value={formatCurrency(data.totalAmountApproved)} />
        <StatCard label="Approval Rate" value={`${approvalRate}%`} sub="of all claims" />
      </div>

      {/* Status breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Claims by Status</h2>
          <div className="space-y-2">
            {data.byStatus.map(({ status, count }) => {
              const pct = data.totalClaims > 0 ? Math.round((count / data.totalClaims) * 100) : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                  <div className="flex-1 rounded-full bg-gray-100 h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${STATUS_COLORS[status] ?? 'bg-gray-300'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-gray-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Claims by Type</h2>
          <div className="space-y-2">
            {data.byType.map(({ type, count }) => {
              const pct = data.totalClaims > 0 ? Math.round((count / data.totalClaims) * 100) : 0;
              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-gray-600 capitalize">{type}</span>
                  <div className="flex-1 rounded-full bg-gray-100 h-2 overflow-hidden">
                    <div className="h-2 rounded-full bg-blue-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-gray-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-right">
        <Link to="/claims" className="text-sm text-blue-600 hover:underline">View all claims →</Link>
      </div>
    </div>
  );
}

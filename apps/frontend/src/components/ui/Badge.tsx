import clsx from 'clsx';
import type { ClaimStatus } from '../../types';

const STATUS_CONFIG: Record<ClaimStatus, { label: string; className: string }> = {
  draft:        { label: 'Draft',        className: 'bg-gray-100 text-gray-700' },
  submitted:    { label: 'Submitted',    className: 'bg-blue-100 text-blue-700' },
  under_review: { label: 'Under Review', className: 'bg-yellow-100 text-yellow-800' },
  approved:     { label: 'Approved',     className: 'bg-green-100 text-green-700' },
  rejected:     { label: 'Rejected',     className: 'bg-red-100 text-red-700' },
  closed:       { label: 'Closed',       className: 'bg-gray-200 text-gray-500' },
};

interface StatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={clsx('badge', config.className, className)}>
      {config.label}
    </span>
  );
}

import type { ClaimType } from '../../types';

const TYPE_CONFIG: Record<ClaimType, { label: string; className: string }> = {
  auto:      { label: 'Auto',      className: 'bg-indigo-100 text-indigo-700' },
  home:      { label: 'Home',      className: 'bg-purple-100 text-purple-700' },
  health:    { label: 'Health',    className: 'bg-teal-100 text-teal-700' },
  life:      { label: 'Life',      className: 'bg-pink-100 text-pink-700' },
  liability: { label: 'Liability', className: 'bg-orange-100 text-orange-700' },
};

interface TypeBadgeProps {
  type: ClaimType;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const config = TYPE_CONFIG[type] ?? { label: type, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={clsx('badge', config.className, className)}>
      {config.label}
    </span>
  );
}

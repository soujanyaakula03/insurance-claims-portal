import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, TypeBadge } from '../components/ui/Badge';

describe('StatusBadge', () => {
  it('renders the correct label for submitted status', () => {
    render(<StatusBadge status="submitted" />);
    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });

  it('renders correct label for approved status', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('renders correct label for under_review status', () => {
    render(<StatusBadge status="under_review" />);
    expect(screen.getByText('Under Review')).toBeInTheDocument();
  });

  it('applies the right color class for rejected', () => {
    const { container } = render(<StatusBadge status="rejected" />);
    expect(container.firstChild).toHaveClass('bg-red-100');
  });
});

describe('TypeBadge', () => {
  it('renders Auto for auto type', () => {
    render(<TypeBadge type="auto" />);
    expect(screen.getByText('Auto')).toBeInTheDocument();
  });

  it('renders Liability for liability type', () => {
    render(<TypeBadge type="liability" />);
    expect(screen.getByText('Liability')).toBeInTheDocument();
  });
});

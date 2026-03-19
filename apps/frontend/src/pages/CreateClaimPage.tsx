import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateClaim } from '../hooks/useQueries';
import { Spinner } from '../components/ui/States';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['auto', 'home', 'health', 'life', 'liability'], { required_error: 'Type is required' }),
  amountClaimed: z.coerce.number().positive('Amount must be positive'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  claimantName: z.string().min(1, 'Claimant name is required'),
  claimantEmail: z.string().email('Valid email required'),
  claimantPhone: z.string().optional(),
  incidentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

type FormData = z.infer<typeof schema>;

export function CreateClaimPage() {
  const navigate = useNavigate();
  const createMutation = useCreateClaim();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const claim = await createMutation.mutateAsync(data);
    navigate(`/claims/${claim.id}`);
  };

  const F = ({ label, id, children, error }: { label: string; id: string; children: React.ReactNode; error?: string }) => (
    <div>
      <label htmlFor={id} className="form-label">{label}</label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link to="/claims" className="text-sm text-gray-500 hover:text-gray-700">← Back to Claims</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">New Claim</h1>
        <p className="mt-0.5 text-sm text-gray-500">Submit a new insurance claim for review.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card p-6 space-y-5">
        {/* Claim info */}
        <div className="pb-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Claim Details</h2>
          <div className="space-y-4">
            <F label="Title *" id="title" error={errors.title?.message}>
              <input id="title" {...register('title')} className="form-input" placeholder="Brief description of the claim" />
            </F>

            <div className="grid grid-cols-2 gap-4">
              <F label="Claim Type *" id="type" error={errors.type?.message}>
                <select id="type" {...register('type')} className="form-input">
                  <option value="">Select type…</option>
                  <option value="auto">Auto</option>
                  <option value="home">Home</option>
                  <option value="health">Health</option>
                  <option value="life">Life</option>
                  <option value="liability">Liability</option>
                </select>
              </F>
              <F label="Amount Claimed ($) *" id="amountClaimed" error={errors.amountClaimed?.message}>
                <input id="amountClaimed" type="number" min="0" step="0.01" {...register('amountClaimed')} className="form-input" placeholder="0.00" />
              </F>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <F label="Policy Number *" id="policyNumber" error={errors.policyNumber?.message}>
                <input id="policyNumber" {...register('policyNumber')} className="form-input" placeholder="POL-AUTO-12345" />
              </F>
              <F label="Incident Date *" id="incidentDate" error={errors.incidentDate?.message}>
                <input id="incidentDate" type="date" {...register('incidentDate')} className="form-input" max={new Date().toISOString().split('T')[0]} />
              </F>
            </div>

            <F label="Description" id="description" error={errors.description?.message}>
              <textarea id="description" rows={3} {...register('description')} className="form-input" placeholder="Additional details about the incident…" />
            </F>
          </div>
        </div>

        {/* Claimant info */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Claimant Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <F label="Full Name *" id="claimantName" error={errors.claimantName?.message}>
                <input id="claimantName" {...register('claimantName')} className="form-input" placeholder="Jane Doe" />
              </F>
              <F label="Email *" id="claimantEmail" error={errors.claimantEmail?.message}>
                <input id="claimantEmail" type="email" {...register('claimantEmail')} className="form-input" placeholder="jane@email.com" />
              </F>
            </div>
            <F label="Phone" id="claimantPhone" error={errors.claimantPhone?.message}>
              <input id="claimantPhone" type="tel" {...register('claimantPhone')} className="form-input" placeholder="415-555-0100" />
            </F>
          </div>
        </div>

        {/* Submit */}
        {createMutation.isError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            Failed to create claim. Please check your input and try again.
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/claims" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={isSubmitting || createMutation.isPending} className="btn-primary">
            {(isSubmitting || createMutation.isPending) ? <Spinner size="sm" /> : null}
            Submit Claim
          </button>
        </div>
      </form>
    </div>
  );
}

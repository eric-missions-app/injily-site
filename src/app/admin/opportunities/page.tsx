import type { Metadata } from 'next';
import Link from 'next/link';
import FilterPills from '@/components/admin/FilterPills';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDateTime, statusLabel } from '@/lib/format';
import { OPPORTUNITY_STAGES, opportunityStageFilter } from '@/lib/validation/admin';
import { requireAdmin } from '@/server/auth';
import { listOpportunities } from '@/server/services/opportunities';

export const metadata: Metadata = { title: 'Opportunities' };

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default async function OpportunitiesPage({ searchParams }: { searchParams: { stage?: string | string[] } }) {
  await requireAdmin();
  const stage = opportunityStageFilter.parse(searchParams.stage);
  const opportunities = await listOpportunities(stage);

  return (
    <>
      <h1 className="text-2xl font-bold">Opportunities</h1>

      <FilterPills
        basePath="/admin/opportunities"
        param="stage"
        values={OPPORTUNITY_STAGES}
        current={stage}
        label="Filter by stage"
      />

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Organization</th>
              <th scope="col" className="px-4 py-3">Stage</th>
              <th scope="col" className="px-4 py-3">Expected start</th>
              <th scope="col" className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id} className="hover:bg-background-light">
                <td className="px-4 py-3 font-semibold">
                  <Link
                    href={`/admin/opportunities/${opportunity.id}`}
                    className={`rounded hover:text-primary ${focusRing}`}
                  >
                    {opportunity.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{opportunity.organizationName ?? '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={opportunity.stage} />
                </td>
                <td className="whitespace-nowrap px-4 py-3">{opportunity.expectedStart ?? '—'}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDateTime(opportunity.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {opportunities.length === 0 && (
          <p className="px-4 py-8 text-center text-muted">
            {stage ? `No opportunities at stage “${statusLabel(stage)}”.` : 'No opportunities yet.'}
          </p>
        )}
      </div>
    </>
  );
}

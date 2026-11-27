import type { Metadata } from 'next';
import Link from 'next/link';
import FilterPills from '@/components/admin/FilterPills';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDateTime, statusLabel } from '@/lib/format';
import { LEAD_STATUSES, leadStatusFilter } from '@/lib/validation/admin';
import { requireAdmin } from '@/server/auth';
import { listLeads } from '@/server/services/leads';

export const metadata: Metadata = { title: 'Leads' };

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default async function LeadsPage({ searchParams }: { searchParams: { status?: string | string[] } }) {
  await requireAdmin();
  const status = leadStatusFilter.parse(searchParams.status);
  const leads = await listLeads(status);

  return (
    <>
      <h1 className="text-2xl font-bold">Leads</h1>

      <FilterPills
        basePath="/admin/leads"
        param="status"
        values={LEAD_STATUSES}
        current={status}
        label="Filter by status"
      />

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Organization</th>
              <th scope="col" className="px-4 py-3">Country</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Owner</th>
              <th scope="col" className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-background-light">
                <td className="px-4 py-3 font-semibold">
                  <Link href={`/admin/leads/${lead.id}`} className={`rounded hover:text-primary ${focusRing}`}>
                    {lead.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{lead.organizationName ?? '—'}</td>
                <td className="px-4 py-3">{lead.country ?? '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3">{lead.ownerEmail ?? <span className="text-muted">unassigned</span>}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDateTime(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="px-4 py-8 text-center text-muted">
            {status ? `No leads with status “${statusLabel(status)}”.` : 'No leads yet.'}
          </p>
        )}
      </div>
    </>
  );
}

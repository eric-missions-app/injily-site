import type { Metadata } from 'next';
import Link from 'next/link';
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

  const filters = [{ label: 'All', value: undefined }, ...LEAD_STATUSES.map((s) => ({ label: statusLabel(s), value: s }))];

  return (
    <>
      <h1 className="text-2xl font-bold">Leads</h1>

      <nav aria-label="Filter by status" className="mt-6">
        <ul className="flex flex-wrap gap-2 text-sm">
          {filters.map((filter) => {
            const active = filter.value === status;
            return (
              <li key={filter.label}>
                <Link
                  href={filter.value ? `/admin/leads?status=${filter.value}` : '/admin/leads'}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-block rounded-full border px-3 py-1 font-semibold ${focusRing} ${
                    active
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-border bg-surface hover:border-primary'
                  }`}
                >
                  {filter.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

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
                    {lead.firstName} {lead.lastName}
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

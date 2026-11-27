import type { Metadata } from 'next';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDateTime, statusLabel } from '@/lib/format';
import { CASE_STATUSES, caseStatusFilter } from '@/lib/validation/admin';
import { requireAdmin } from '@/server/auth';
import { listCases } from '@/server/services/cases';

export const metadata: Metadata = { title: 'Cases' };

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default async function CasesPage({ searchParams }: { searchParams: { status?: string | string[] } }) {
  await requireAdmin();
  const status = caseStatusFilter.parse(searchParams.status);
  const cases = await listCases(status);

  const filters = [{ label: 'All', value: undefined }, ...CASE_STATUSES.map((s) => ({ label: statusLabel(s), value: s }))];

  return (
    <>
      <h1 className="text-2xl font-bold">Service Cases</h1>

      <nav aria-label="Filter by status" className="mt-6">
        <ul className="flex flex-wrap gap-2 text-sm">
          {filters.map((filter) => {
            const active = filter.value === status;
            return (
              <li key={filter.label}>
                <Link
                  href={filter.value ? `/admin/cases?status=${filter.value}` : '/admin/cases'}
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
            {cases.map((serviceCase) => (
              <tr key={serviceCase.id} className="hover:bg-background-light">
                <td className="px-4 py-3 font-semibold">
                  <Link href={`/admin/cases/${serviceCase.id}`} className={`rounded hover:text-primary ${focusRing}`}>
                    {serviceCase.firstName} {serviceCase.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3">{serviceCase.organizationName ?? '—'}</td>
                <td className="px-4 py-3">{serviceCase.country ?? '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={serviceCase.status} />
                </td>
                <td className="px-4 py-3">
                  {serviceCase.ownerEmail ?? <span className="text-muted">unassigned</span>}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDateTime(serviceCase.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {cases.length === 0 && (
          <p className="px-4 py-8 text-center text-muted">
            {status ? `No cases with status “${statusLabel(status)}”.` : 'No cases yet.'}
          </p>
        )}
      </div>
    </>
  );
}

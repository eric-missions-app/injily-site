import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import ActionForm from '@/components/admin/ActionForm';
import Detail from '@/components/admin/Detail';
import { fieldClass as field } from '@/components/admin/Fields';
import StatusBadge from '@/components/admin/StatusBadge';
import Timeline from '@/components/admin/Timeline';
import { formatDateTime, statusLabel } from '@/lib/format';
import { CASE_STATUSES } from '@/lib/validation/admin';
import { addNoteAction, changeOwner, changeStatus } from '@/app/admin/actions';
import { requireAdmin } from '@/server/auth';
import { getCase } from '@/server/services/cases';

export const metadata: Metadata = { title: 'Service Case' };

const card = 'rounded-lg border border-border bg-surface p-5';
const link = 'rounded text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default async function CasePage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const id = z.uuid().safeParse(params.id);
  if (!id.success) notFound();
  const detail = await getCase(id.data);
  if (!detail) notFound();
  const { serviceCase, person, organization, activities } = detail;

  return (
    <>
      <p className="text-sm text-muted">
        <Link href="/admin/cases" className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Cases
        </Link>{' '}
        / {person.name}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{person.name}</h1>
        <StatusBadge status={serviceCase.status} />
      </div>
      <p className="mt-1 text-sm text-muted">Created {formatDateTime(serviceCase.createdAt)}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={card} aria-labelledby="request">
            <h2 id="request" className="font-bold">Request</h2>
            <dl className="mt-3">
              <Detail label="Subject" value={serviceCase.subject} />
            </dl>
            <h3 className="mt-4 text-sm text-muted">Message</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm">
              {serviceCase.message || <span className="text-muted">—</span>}
            </p>
          </section>

          <section className={card} aria-labelledby="person">
            <h2 id="person" className="font-bold">Person</h2>
            <dl className="mt-3">
              <Detail
                label="Name"
                value={
                  <Link href={`/admin/people/${person.id}`} className={link}>
                    {person.name}
                  </Link>
                }
              />
              <Detail
                label="Email"
                value={
                  <a href={`mailto:${person.email}`} className="text-primary hover:underline">
                    {person.email}
                  </a>
                }
              />
              <Detail label="Phone" value={person.phone} />
              <Detail label="Role" value={person.role} />
              <Detail label="City" value={person.city} />
              <Detail label="Country" value={person.country} />
            </dl>
          </section>

          <section className={card} aria-labelledby="organization">
            <h2 id="organization" className="font-bold">Organization</h2>
            {organization ? (
              <dl className="mt-3">
                <Detail
                  label="Name"
                  value={
                    <Link href={`/admin/organizations/${organization.id}`} className={link}>
                      {organization.name}
                    </Link>
                  }
                />
                <Detail label="Type" value={statusLabel(organization.type)} />
                <Detail label="City" value={organization.city} />
                <Detail label="Country" value={organization.country} />
                <Detail label="Website" value={organization.website} />
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted">No organization on file.</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className={card} aria-labelledby="work">
            <h2 id="work" className="font-bold">Work this case</h2>

            <div className="mt-4">
              <ActionForm action={changeStatus} submitLabel="Save status">
                <input type="hidden" name="recordType" value="service_case" />
                <input type="hidden" name="id" value={serviceCase.id} />
                <label htmlFor="status" className="block text-sm font-semibold">Status</label>
                <select id="status" name="status" defaultValue={serviceCase.status} className={field}>
                  {CASE_STATUSES.map((s) => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>
              </ActionForm>
            </div>

            <div className="mt-6">
              <ActionForm action={changeOwner} submitLabel="Save owner">
                <input type="hidden" name="recordType" value="service_case" />
                <input type="hidden" name="id" value={serviceCase.id} />
                <label htmlFor="ownerEmail" className="block text-sm font-semibold">Owner</label>
                <input
                  id="ownerEmail"
                  name="ownerEmail"
                  type="email"
                  defaultValue={serviceCase.ownerEmail ?? ''}
                  placeholder="name@example.com"
                  aria-describedby="ownerEmail-hint"
                  className={field}
                />
                <p id="ownerEmail-hint" className="text-xs text-muted">Leave empty to unassign.</p>
              </ActionForm>
            </div>

            <div className="mt-6">
              <ActionForm action={addNoteAction} submitLabel="Add note" resetOnSave>
                <input type="hidden" name="recordType" value="service_case" />
                <input type="hidden" name="id" value={serviceCase.id} />
                <label htmlFor="body" className="block text-sm font-semibold">Note</label>
                <textarea id="body" name="body" rows={4} required maxLength={5000} className={field} />
              </ActionForm>
            </div>
          </section>

          <Timeline activities={activities} />
        </div>
      </div>
    </>
  );
}

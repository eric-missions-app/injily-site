import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import ActionForm from '@/components/admin/ActionForm';
import Detail from '@/components/admin/Detail';
import { SelectField, TextAreaField, TextField } from '@/components/admin/Fields';
import StatusBadge from '@/components/admin/StatusBadge';
import Timeline from '@/components/admin/Timeline';
import { formatDateTime, statusLabel } from '@/lib/format';
import { OPPORTUNITY_STAGES } from '@/lib/validation/admin';
import { saveOpportunity } from '@/app/admin/actions';
import { requireAdmin } from '@/server/auth';
import { getOpportunity } from '@/server/services/opportunities';

export const metadata: Metadata = { title: 'Opportunity' };

const card = 'rounded-lg border border-border bg-surface p-5';
const link = 'rounded text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default async function OpportunityPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const id = z.uuid().safeParse(params.id);
  if (!id.success) notFound();
  const detail = await getOpportunity(id.data);
  if (!detail) notFound();
  const { opportunity, organization, lead, activities } = detail;

  return (
    <>
      <p className="text-sm text-muted">
        <Link href="/admin/opportunities" className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Opportunities
        </Link>{' '}
        / {opportunity.name}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{opportunity.name}</h1>
        <StatusBadge status={opportunity.stage} />
      </div>
      <p className="mt-1 text-sm text-muted">Created {formatDateTime(opportunity.createdAt)}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={card} aria-labelledby="links">
            <h2 id="links" className="font-bold">From</h2>
            <dl className="mt-3">
              <Detail
                label="Organization"
                value={
                  organization && (
                    <Link href={`/admin/organizations/${organization.id}`} className={link}>
                      {organization.name}
                    </Link>
                  )
                }
              />
              <Detail
                label="Lead"
                value={
                  lead && (
                    <span className="flex flex-wrap items-center gap-2">
                      <Link href={`/admin/leads/${lead.id}`} className={link}>
                        {lead.name}
                      </Link>
                      <StatusBadge status={lead.status} />
                    </span>
                  )
                }
              />
            </dl>
          </section>

          <section className={card} aria-labelledby="details">
            <h2 id="details" className="font-bold">Details</h2>
            <div className="mt-4">
              <ActionForm action={saveOpportunity} submitLabel="Save opportunity" noValidate>
                <input type="hidden" name="id" value={opportunity.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField name="name" label="Name" defaultValue={opportunity.name} autoComplete="off" />
                  <SelectField
                    name="stage"
                    label="Stage"
                    defaultValue={opportunity.stage}
                    options={OPPORTUNITY_STAGES.map((s) => ({ value: s, label: statusLabel(s) }))}
                  />
                  <TextField
                    name="expectedStart"
                    label="Expected start"
                    type="date"
                    defaultValue={opportunity.expectedStart}
                  />
                </div>
                <TextAreaField name="notes" label="Notes" defaultValue={opportunity.notes} rows={6} />
              </ActionForm>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Timeline activities={activities} />
        </div>
      </div>
    </>
  );
}

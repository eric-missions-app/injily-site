import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import ActionForm from '@/components/admin/ActionForm';
import { SelectField, TextField } from '@/components/admin/Fields';
import RelatedList from '@/components/admin/RelatedList';
import { formatDateTime } from '@/lib/format';
import { savePerson } from '@/app/admin/actions';
import { requireAdmin } from '@/server/auth';
import { listOrganizationOptions } from '@/server/services/organizations';
import { getPerson } from '@/server/services/people';

export const metadata: Metadata = { title: 'Person' };

export default async function PersonPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const id = z.uuid().safeParse(params.id);
  if (!id.success) notFound();
  const [detail, organizationOptions] = await Promise.all([getPerson(id.data), listOrganizationOptions()]);
  if (!detail) notFound();
  const { person, leads, cases } = detail;
  const name = `${person.firstName} ${person.lastName}`;

  return (
    <>
      <p className="text-sm text-muted">
        <Link href="/admin/people" className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          People
        </Link>{' '}
        / {name}
      </p>
      <h1 className="mt-2 text-2xl font-bold">{name}</h1>
      <p className="mt-1 text-sm text-muted">
        Added {formatDateTime(person.createdAt)} · consented {formatDateTime(person.consentAt)}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-border bg-surface p-5 lg:col-span-2" aria-labelledby="details">
          <h2 id="details" className="font-bold">Details</h2>
          <div className="mt-4">
            <ActionForm action={savePerson} submitLabel="Save person" noValidate>
              <input type="hidden" name="id" value={person.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="firstName" label="First name" defaultValue={person.firstName} autoComplete="off" />
                <TextField name="lastName" label="Last name" defaultValue={person.lastName} autoComplete="off" />
                <TextField name="email" label="Email" type="email" defaultValue={person.email} autoComplete="off" />
                <TextField name="phone" label="Phone" type="tel" defaultValue={person.phone} autoComplete="off" />
                <TextField name="city" label="City" defaultValue={person.city} autoComplete="off" />
                <TextField
                  name="country"
                  label="Country"
                  hint="Two-letter code, like BR."
                  defaultValue={person.country}
                  maxLength={2}
                  autoComplete="off"
                />
                <TextField name="role" label="Role" defaultValue={person.role} autoComplete="off" />
                <SelectField
                  name="organizationId"
                  label="Organization"
                  defaultValue={person.organizationId ?? ''}
                  options={[
                    { value: '', label: 'No organization' },
                    ...organizationOptions.map((o) => ({ value: o.id, label: `${o.name} (${o.country})` })),
                  ]}
                />
              </div>
            </ActionForm>
          </div>
        </section>

        <div className="space-y-6">
          <RelatedList
            id="leads"
            title="Leads"
            empty="No leads."
            items={leads.map((lead) => ({
              id: lead.id,
              href: `/admin/leads/${lead.id}`,
              title: lead.interest || lead.organizationName || 'Lead',
              detail: formatDateTime(lead.createdAt),
              status: lead.status,
            }))}
          />
          <RelatedList
            id="cases"
            title="Service Cases"
            empty="No cases."
            items={cases.map((serviceCase) => ({
              id: serviceCase.id,
              href: `/admin/cases/${serviceCase.id}`,
              title: serviceCase.subject || 'Service Case',
              detail: formatDateTime(serviceCase.createdAt),
              status: serviceCase.status,
            }))}
          />
        </div>
      </div>
    </>
  );
}

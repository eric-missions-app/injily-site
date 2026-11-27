import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import ActionForm from '@/components/admin/ActionForm';
import { SelectField, TextField } from '@/components/admin/Fields';
import RelatedList from '@/components/admin/RelatedList';
import { formatDateTime, statusLabel } from '@/lib/format';
import { ORGANIZATION_TYPES } from '@/lib/validation/admin';
import { saveOrganization } from '@/app/admin/actions';
import { requireAdmin } from '@/server/auth';
import { getOrganization } from '@/server/services/organizations';

export const metadata: Metadata = { title: 'Organization' };

export default async function OrganizationPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const id = z.uuid().safeParse(params.id);
  if (!id.success) notFound();
  const detail = await getOrganization(id.data);
  if (!detail) notFound();
  const { organization, people, leads, opportunities } = detail;

  return (
    <>
      <p className="text-sm text-muted">
        <Link href="/admin/organizations" className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Organizations
        </Link>{' '}
        / {organization.name}
      </p>
      <h1 className="mt-2 text-2xl font-bold">{organization.name}</h1>
      <p className="mt-1 text-sm text-muted">Added {formatDateTime(organization.createdAt)}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-border bg-surface p-5 lg:col-span-2" aria-labelledby="details">
          <h2 id="details" className="font-bold">Details</h2>
          <div className="mt-4">
            <ActionForm action={saveOrganization} submitLabel="Save organization" noValidate>
              <input type="hidden" name="id" value={organization.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="name" label="Name" defaultValue={organization.name} autoComplete="off" />
                <SelectField
                  name="type"
                  label="Type"
                  defaultValue={organization.type}
                  options={ORGANIZATION_TYPES.map((t) => ({ value: t, label: statusLabel(t) }))}
                />
                <TextField name="city" label="City" defaultValue={organization.city} autoComplete="off" />
                <TextField
                  name="country"
                  label="Country"
                  hint="Two-letter code, like BR."
                  defaultValue={organization.country}
                  maxLength={2}
                  autoComplete="off"
                />
                <TextField
                  name="website"
                  label="Website"
                  type="url"
                  defaultValue={organization.website}
                  autoComplete="off"
                />
              </div>
            </ActionForm>
          </div>
        </section>

        <div className="space-y-6">
          <RelatedList
            id="people"
            title="People"
            empty="No people."
            items={people.map((person) => ({
              id: person.id,
              href: `/admin/people/${person.id}`,
              title: `${person.firstName} ${person.lastName}`,
              detail: person.role ? `${person.role} · ${person.email}` : person.email,
            }))}
          />
          <RelatedList
            id="leads"
            title="Leads"
            empty="No leads."
            items={leads.map((lead) => ({
              id: lead.id,
              href: `/admin/leads/${lead.id}`,
              title: `${lead.firstName} ${lead.lastName}`,
              detail: formatDateTime(lead.createdAt),
              status: lead.status,
            }))}
          />
          <RelatedList
            id="opportunities"
            title="Opportunities"
            empty="No opportunities."
            items={opportunities.map((opportunity) => ({
              id: opportunity.id,
              href: `/admin/opportunities/${opportunity.id}`,
              title: opportunity.name,
              detail: formatDateTime(opportunity.createdAt),
              status: opportunity.stage,
            }))}
          />
        </div>
      </div>
    </>
  );
}

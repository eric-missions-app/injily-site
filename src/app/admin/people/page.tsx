import type { Metadata } from 'next';
import Link from 'next/link';
import { fieldClass } from '@/components/admin/Fields';
import { searchQuery } from '@/lib/validation/admin';
import { requireAdmin } from '@/server/auth';
import { listPeople } from '@/server/services/people';

export const metadata: Metadata = { title: 'People' };

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default async function PeoplePage({ searchParams }: { searchParams: { q?: string | string[] } }) {
  await requireAdmin();
  const q = searchQuery.parse(searchParams.q);
  const people = await listPeople(q);

  return (
    <>
      <h1 className="text-2xl font-bold">People</h1>

      <form role="search" method="get" action="/admin/people" className="mt-6 flex max-w-md gap-2">
        <label htmlFor="q" className="sr-only">
          Search by name or email
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q ?? ''}
          maxLength={100}
          placeholder="Search by name or email"
          className={fieldClass}
        />
        <button
          type="submit"
          className={`rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold hover:border-primary ${focusRing}`}
        >
          Search
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Email</th>
              <th scope="col" className="px-4 py-3">Organization</th>
              <th scope="col" className="px-4 py-3">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {people.map((person) => (
              <tr key={person.id} className="hover:bg-background-light">
                <td className="px-4 py-3 font-semibold">
                  <Link href={`/admin/people/${person.id}`} className={`rounded hover:text-primary ${focusRing}`}>
                    {person.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{person.email}</td>
                <td className="px-4 py-3">{person.organizationName ?? '—'}</td>
                <td className="px-4 py-3">{person.country ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {people.length === 0 && (
          <p className="px-4 py-8 text-center text-muted">{q ? `No one matches “${q}”.` : 'No people yet.'}</p>
        )}
      </div>
    </>
  );
}

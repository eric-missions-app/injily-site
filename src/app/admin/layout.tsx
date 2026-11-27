import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/server/auth';
import { signOutAction } from './actions';

// Signed-in CRM: always rendered per request, never cached, never indexed.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | injily admin' },
  robots: { index: false, follow: false },
};

const ADMIN_NAV = [
  { label: 'Leads', href: '/admin/leads' },
  { label: 'Cases', href: '/admin/cases' },
  { label: 'People', href: '/admin/people' },
  { label: 'Organizations', href: '/admin/organizations' },
  { label: 'Opportunities', href: '/admin/opportunities' },
];

const focusRing = 'rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await requireAdmin();

  return (
    <div className="min-h-screen bg-background-light text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
          <Link href="/admin/leads" className={`text-lg font-bold ${focusRing}`}>
            injily <span className="font-medium text-muted">admin</span>
          </Link>
          <nav aria-label="Admin">
            <ul className="flex gap-6 text-sm font-semibold">
              {ADMIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`hover:text-primary ${focusRing}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="hidden text-muted sm:inline">{email}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className={`rounded-md border border-border px-3 py-1.5 font-semibold hover:bg-background-light ${focusRing}`}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

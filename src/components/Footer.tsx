import Link from 'next/link';
import { FOOTER_COLUMNS, SITE_NAME } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background-light">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link
              href="/"
              className="rounded-md text-2xl font-extrabold tracking-tight text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {SITE_NAME}
            </Link>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.label}>
              <h2 className="text-sm font-bold text-text">{column.label}</h2>
              <ul className="mt-4 space-y-3">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-sm text-sm text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-border pt-8 text-sm text-muted">
          © {year} {SITE_NAME}. Built for the harvest.
        </p>
      </div>
    </footer>
  );
}

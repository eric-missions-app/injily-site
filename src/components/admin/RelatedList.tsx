import Link from 'next/link';
import StatusBadge, { type Status } from './StatusBadge';

export type RelatedItem = {
  id: string;
  href: string;
  title: string;
  /** A muted second line, e.g. an email or a date. */
  detail?: string;
  status?: Status;
};

type Props = {
  /** The card's heading id, unique on the page. */
  id: string;
  title: string;
  items: RelatedItem[];
  empty: string;
};

/** A card listing a record's related records (a person's leads, an organization's people), each one a link. */
export default function RelatedList({ id, title, items, empty }: Props) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5" aria-labelledby={id}>
      <h2 id={id} className="font-bold">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <div className="min-w-0">
                <Link
                  href={item.href}
                  className="rounded font-semibold hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {item.title}
                </Link>
                {item.detail && <p className="truncate text-xs text-muted">{item.detail}</p>}
              </div>
              {item.status && <StatusBadge status={item.status} />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import Link from 'next/link';
import { statusLabel } from '@/lib/format';

type Props = {
  /** The list's path, e.g. `/admin/leads`. */
  basePath: string;
  /** The query parameter, e.g. `status` or `stage`. */
  param: string;
  values: readonly string[];
  /** The active value; `undefined` is "All". */
  current: string | undefined;
  label: string;
};

/** The row of filter links above an admin list: "All", then one per value. The active one is filled. */
export default function FilterPills({ basePath, param, values, current, label }: Props) {
  const filters = [{ label: 'All', value: undefined }, ...values.map((v) => ({ label: statusLabel(v), value: v }))];

  return (
    <nav aria-label={label} className="mt-6">
      <ul className="flex flex-wrap gap-2 text-sm">
        {filters.map((filter) => {
          const active = filter.value === current;
          return (
            <li key={filter.label}>
              <Link
                href={filter.value ? `${basePath}?${param}=${filter.value}` : basePath}
                aria-current={active ? 'page' : undefined}
                className={`inline-block rounded-full border px-3 py-1 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active ? 'border-primary bg-primary text-on-primary' : 'border-border bg-surface hover:border-primary'
                }`}
              >
                {filter.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

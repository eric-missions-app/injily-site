import Link from 'next/link';
import type { NavLink } from '@/lib/site';

type ProductHeroProps = {
  /** The breadcrumb's first crumb, e.g. `{ label: 'Product', href: '/#features' }`. */
  parent: NavLink;
  /** The page's short name, shown as the breadcrumb's current crumb, e.g. "Convert tracking". */
  name: string;
  title: string;
  subtitle: string;
  /** A static, token-styled picture of the feature. Read as one image, described by `visualLabel`. */
  visual: React.ReactNode;
  visualLabel: string;
};

// Above the fold, so no entrance motion: it shows on first paint, without any JavaScript.
/** The opening section of a product or use-case page: breadcrumb back to the parent, title, subtitle and visual. */
export default function ProductHero({ parent, name, title, subtitle, visual, visualLabel }: ProductHeroProps) {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm font-semibold">
            <li>
              <Link
                href={parent.href}
                className="rounded-sm text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {parent.label}
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted">
              /
            </li>
            <li aria-current="page" className="text-muted">
              {name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl">{title}</h1>
            <p className="mt-6 max-w-xl text-lg text-muted">{subtitle}</p>
          </div>
          <div role="img" aria-label={visualLabel}>
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import type { NavLink } from '@/lib/site';

export type ProductPoint = {
  /** A Material Symbols name; add it to `icon_names` in `src/app/layout.tsx`. */
  icon: string;
  title: string;
  body: string;
  /** An optional "More about <label>" link to an existing `/product` page (the use-case pages use it). */
  link?: NavLink;
};

type ProductFeaturesProps = {
  title: string;
  subtitle?: string;
  /** At most three points. */
  points: ProductPoint[];
};

/** A product or use-case page's grid of up to three points, each with an icon, a title, a line and an optional link. */
export default function ProductFeatures({ title, subtitle, points }: ProductFeaturesProps) {
  return (
    <section className="bg-background-light">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
        </FadeIn>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {points.map((point, index) => (
            <li key={point.title}>
              <FadeIn
                delay={index * 0.1}
                className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6"
              >
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl text-primary"
                >
                  {point.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-text">{point.title}</h3>
                <p className="mt-2 flex-1 text-muted">{point.body}</p>
                {point.link && (
                  <Link
                    href={point.link.href}
                    className="mt-4 inline-flex items-center gap-1 self-start rounded-md text-sm font-bold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    More about {point.link.label}
                    <span aria-hidden="true" className="material-symbols-outlined text-lg">
                      arrow_forward
                    </span>
                  </Link>
                )}
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import type { NavLink } from '@/lib/site';

type UseCaseSectionProps = {
  /** The section background; alternate them down the page, starting with `light` after the hero. */
  tone: 'default' | 'light';
  /** A Material Symbols name; add it to `icon_names` in `src/app/layout.tsx`. */
  icon: string;
  title: string;
  body: string;
  /** 2 to 4 short lines, shown as a checklist beside the text. */
  points: string[];
  /** The product pages this section is about, e.g. `{ label: 'Mentoring', href: '/product/mentoring' }`. */
  links: NavLink[];
};

/** One section of a use-case page: what injily does for this audience, a checklist, and links to its product pages. */
export default function UseCaseSection({ tone, icon, title, body, points, links }: UseCaseSectionProps) {
  return (
    <section className={tone === 'light' ? 'bg-background-light' : 'bg-background'}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <FadeIn>
          <span
            aria-hidden="true"
            className="material-symbols-outlined flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl text-primary"
          >
            {icon}
          </span>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-xl text-lg text-muted">{body}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 rounded-md font-bold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  More about {link.label}
                  <span aria-hidden="true" className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ul className="space-y-4 rounded-2xl border border-border bg-surface p-6 sm:p-8">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-text">
                <span aria-hidden="true" className="material-symbols-outlined text-2xl text-success">
                  task_alt
                </span>
                <span className="pt-0.5">{point}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

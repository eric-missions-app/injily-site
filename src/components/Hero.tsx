import Link from 'next/link';
import { HERO_SUBHEAD } from '@/content/hero';
import { CTA_HREF, CTA_LABEL } from '@/lib/site';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

// Above the fold, so no entrance motion: the copy shows on first paint, without any JavaScript.
export default function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          Discipleship made simple
        </p>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl">
          Never lose a <span className="text-primary">new believer</span> again.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{HERO_SUBHEAD}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={CTA_HREF}
            className={`inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-on-primary transition-colors hover:bg-primary-hover ${focusRing}`}
          >
            {CTA_LABEL}
          </Link>
          <a
            href="#features"
            className={`inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-bold text-text transition-colors hover:bg-background-light ${focusRing}`}
          >
            What we&apos;re building
          </a>
        </div>
      </div>
    </section>
  );
}

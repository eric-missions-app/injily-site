import Image from 'next/image';
import Link from 'next/link';
import { CTA_HREF, CTA_LABEL } from '@/lib/site';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

// Above the fold, so no entrance motion: the copy and illustration show on first paint, without any JavaScript.
export default function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            Discipleship made simple
          </p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl">
            Never lose a <span className="text-primary">new believer</span> again.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            injily helps churches and evangelists track every convert, assign mentors, and complete follow-ups — so
            the harvest is never wasted.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={CTA_HREF}
              className={`inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-on-primary transition-colors hover:bg-primary-hover ${focusRing}`}
            >
              {CTA_LABEL}
            </Link>
            <a
              href="#how-it-works"
              className={`inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-bold text-text transition-colors hover:bg-background-light ${focusRing}`}
            >
              See how it works
            </a>
          </div>
        </div>

        <Image
          src="/hero-illustration.svg"
          alt="The injily dashboard: a list of new believers with their follow-up status, an upcoming meeting and a mentor pairing."
          width={640}
          height={480}
          priority
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}

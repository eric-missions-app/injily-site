import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { CTA_HREF, CTA_LABEL } from '@/lib/site';

/** The dark call-to-action card every marketing page ends with (except /get-started and /contact). */
export default function CTA() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="rounded-3xl bg-primary-darker px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-on-primary-darker sm:text-4xl">
            Want to be first to try injily?
          </h2>
          <p className="mt-4 text-lg text-on-primary-darker/80">Leave your details and we&apos;ll be in touch.</p>
          <Link
            href={CTA_HREF}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-surface px-6 py-3 text-base font-bold text-primary transition-colors hover:bg-background-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-primary-darker"
          >
            {CTA_LABEL}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

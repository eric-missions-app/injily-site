import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import FaqAccordion from '@/components/FaqAccordion';
import { FAQ } from '@/content/faq';
import { FAQ_LINK } from '@/lib/site';

const PREVIEW = FAQ.slice(0, 4);

export default function FaqPreview() {
  return (
    <section className="bg-background-light">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">Frequently asked questions</h2>
        </FadeIn>

        <div className="mt-12">
          <FaqAccordion entries={PREVIEW} headingLevel="h3" />
        </div>

        <div className="mt-8 text-center">
          <Link
            href={FAQ_LINK.href}
            className="inline-flex items-center gap-1 rounded-md font-bold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            See all questions
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

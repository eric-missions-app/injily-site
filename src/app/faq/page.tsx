import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import FaqAccordion from '@/components/FaqAccordion';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { FAQ } from '@/content/faq';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about injily: who it is for, whether converts need an account, privacy, cost, the mobile app and how to get started.',
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Above the fold, so no entrance motion. */}
        <section className="bg-background-light">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl">
                Frequently asked questions
              </h1>
              <p className="mt-6 text-lg text-muted">
                What injily is, who it&apos;s for, and how to get your church started.
              </p>
            </div>

            <div className="mt-12">
              <FaqAccordion entries={FAQ} headingLevel="h2" />
            </div>
          </div>
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}

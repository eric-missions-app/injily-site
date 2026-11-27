import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-background-light">
          <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
            <p className="text-sm font-semibold text-primary">404</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-text sm:text-5xl">Page not found</h1>
            <p className="mt-6 text-lg text-muted">
              We couldn&apos;t find the page you were looking for. It may have moved, or the link may be wrong.
            </p>
            <Link
              href="/"
              className="mt-10 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

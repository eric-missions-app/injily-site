import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LeadForm from '@/components/forms/LeadForm';

export const metadata: Metadata = {
  title: 'Get early access',
  description:
    'Ask for early access to injily. Someone from our team will get in touch to learn about your ministry and help you get started.',
};

export default function GetStartedPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-background-light">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl">Get early access</h1>
            <p className="mt-4 text-lg text-muted">
              Tell us a little about you and your ministry. A person from our team will read it and get in touch to
              hear what you need and help you get started with injily.
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <LeadForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import CaseForm from '@/components/forms/CaseForm';

export const metadata: Metadata = {
  title: 'Contact us',
  description: 'Have a question about injily? Send us a message and someone from our team will follow up shortly.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-background-light">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl">Contact us</h1>
            <p className="mt-4 text-lg text-muted">
              Send us a question and someone from our team will get back to you.
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <CaseForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Features from '@/components/Features';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WhyItMatters from '@/components/WhyItMatters';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Hero />
        <WhyItMatters />
        <Features />
      </main>
      <Footer />
    </>
  );
}

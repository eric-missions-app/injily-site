import Audiences from '@/components/Audiences';
import CTA from '@/components/CTA';
import FaqPreview from '@/components/FaqPreview';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import WhyItMatters from '@/components/WhyItMatters';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Hero />
        <WhyItMatters />
        <Features />
        <HowItWorks />
        <Audiences />
        <FaqPreview />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    "We're building injily to help you see which new believers need attention, so you know who to reach out to.",
};

const POINTS: ProductPoint[] = [
  {
    icon: 'person_search',
    title: 'See who needs attention',
    body: 'injily will help you see which new believers need attention, so you know who to reach out to.',
  },
  {
    icon: 'person_add',
    title: 'Keep track of every new believer',
    body: 'injily will keep track of each person after they respond, so nobody slips through the cracks.',
  },
  {
    icon: 'how_to_reg',
    title: 'Someone responsible for each person',
    body: 'injily will make sure someone on your team is responsible for following up with each new believer.',
  },
];

export default function InsightsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: 'Product', href: '/#features' }}
          name="Insights"
          title="See which new believers need attention."
          subtitle="We're building injily to help you see which new believers need attention, so you know who to reach out to."
        />
        <ProductFeatures title="What we're building" points={POINTS} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

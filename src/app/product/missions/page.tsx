import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';

export const metadata: Metadata = {
  title: 'Missions',
  description:
    "We're building injily to help mission and outreach teams follow up with every new believer they meet.",
};

const POINTS: ProductPoint[] = [
  {
    icon: 'person_add',
    title: 'Keep track of every new believer',
    body: 'injily will keep track of each person who responds during your outreach, so nobody is forgotten.',
  },
  {
    icon: 'how_to_reg',
    title: 'Someone responsible for each person',
    body: 'injily will make sure someone on your team is responsible for following up with each new believer.',
  },
  {
    icon: 'person_search',
    title: 'See who needs attention',
    body: 'injily will help your team see which new believers need attention, so you know who to reach out to.',
  },
];

export default function MissionsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: 'Product', href: '/#features' }}
          name="Missions"
          title="Follow up with every new believer from your outreach."
          subtitle="We're building injily to help mission and outreach teams follow up with every new believer they meet."
        />
        <ProductFeatures title="What we're building" points={POINTS} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

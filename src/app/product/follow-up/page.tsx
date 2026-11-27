import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';

export const metadata: Metadata = {
  title: 'Follow-up',
  description:
    "We're building injily to help your team follow up with every new believer, with someone responsible for each person.",
};

const POINTS: ProductPoint[] = [
  {
    icon: 'how_to_reg',
    title: 'Someone responsible for each person',
    body: 'injily will make sure someone on your team is responsible for following up with every new believer.',
  },
  {
    icon: 'person_add',
    title: 'Nobody slips through the cracks',
    body: 'injily will keep track of each person after they respond, so every new believer is followed up.',
  },
  {
    icon: 'person_search',
    title: 'See who needs attention',
    body: 'injily will help your team see who needs attention, so you know who to reach out to next.',
  },
];

export default function FollowUpPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: 'Product', href: '/#features' }}
          name="Follow-up"
          title="Make sure every new believer is followed up."
          subtitle="We're building injily to help your team follow up with every new believer, with someone responsible for each person."
        />
        <ProductFeatures title="What we're building" points={POINTS} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

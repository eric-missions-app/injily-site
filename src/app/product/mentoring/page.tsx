import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';

export const metadata: Metadata = {
  title: 'Mentoring',
  description:
    "We're building injily to make sure someone on your team is responsible for following up with each new believer.",
};

const POINTS: ProductPoint[] = [
  {
    icon: 'how_to_reg',
    title: 'Someone from your team for each person',
    body: 'injily will make sure every new believer has someone on your team responsible for following up with them.',
  },
  {
    icon: 'person_add',
    title: 'Keep track of each new believer',
    body: 'injily will keep track of each person after they respond, so your team knows who they are following up with.',
  },
  {
    icon: 'person_search',
    title: 'See who needs attention',
    body: 'injily will help you see which new believers need attention, so nobody is left without someone.',
  },
];

export default function MentoringPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: 'Product', href: '/#features' }}
          name="Mentoring"
          title="Someone from your team for every new believer."
          subtitle="We're building injily to make sure someone on your team is responsible for following up with each new believer."
        />
        <ProductFeatures title="What we're building" points={POINTS} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

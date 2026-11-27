import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';
import { USE_CASES_NAV } from '@/lib/site';

export const metadata: Metadata = {
  title: 'For evangelists',
  description:
    "We're building injily to help evangelists make sure someone on their team follows up with every person who responds.",
};

const POINTS: ProductPoint[] = [
  {
    icon: 'person_add',
    title: 'Keep track of every new believer',
    body: 'injily will keep track of each person who responds when you share the gospel.',
    link: { label: 'Convert tracking', href: '/product/convert-tracking' },
  },
  {
    icon: 'how_to_reg',
    title: 'Someone from your team for each person',
    body: 'injily will make sure someone on your team is responsible for following up with each new believer.',
    link: { label: 'Mentoring', href: '/product/mentoring' },
  },
  {
    icon: 'person_search',
    title: 'See who needs attention',
    body: 'injily will help you see which new believers need attention, so you know who to reach out to.',
    link: { label: 'Insights', href: '/product/insights' },
  },
];

export default function EvangelistsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: USE_CASES_NAV.label, href: '/#audiences' }}
          name="Evangelists"
          title="Make sure every person who responds is followed up."
          subtitle="We're building injily to help evangelists make sure someone on their team follows up with every person who responds."
        />
        <ProductFeatures title="What we're building" points={POINTS} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

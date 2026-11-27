import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';
import { USE_CASES_NAV } from '@/lib/site';

export const metadata: Metadata = {
  title: 'For churches',
  description:
    "We're building injily to help pastors and their teams make sure every person who responds at their church is followed up.",
};

const POINTS: ProductPoint[] = [
  {
    icon: 'person_add',
    title: 'Keep track of every new believer',
    body: 'injily will keep track of each person who responds at your church, so nobody slips through the cracks.',
    link: { label: 'Convert tracking', href: '/product/convert-tracking' },
  },
  {
    icon: 'how_to_reg',
    title: 'Someone responsible for each person',
    body: 'injily will make sure someone on your team is responsible for following up with each new believer.',
    link: { label: 'Follow-up', href: '/product/follow-up' },
  },
  {
    icon: 'person_search',
    title: 'See who needs attention',
    body: 'injily will help you see which new believers need attention, so you know who to reach out to.',
    link: { label: 'Insights', href: '/product/insights' },
  },
];

export default function ChurchesPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: USE_CASES_NAV.label, href: '/#audiences' }}
          name="Churches"
          title="Follow up with every new believer at your church."
          subtitle="We're building injily to help pastors and their teams make sure every person who responds at their church is followed up."
        />
        <ProductFeatures title="What we're building" points={POINTS} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

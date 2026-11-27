import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';
import { USE_CASES_NAV } from '@/lib/site';

export const metadata: Metadata = {
  title: 'For mission teams',
  description:
    "We're building injily to help mission and outreach teams make sure every new believer they meet has someone following up.",
};

const POINTS: ProductPoint[] = [
  {
    icon: 'person_add',
    title: 'Keep track of every new believer',
    body: 'injily will keep track of each person who responds during your outreach, so nobody is forgotten.',
    link: { label: 'Missions', href: '/product/missions' },
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
    body: 'injily will help your team see which new believers need attention, so you know who to reach out to.',
    link: { label: 'Insights', href: '/product/insights' },
  },
];

export default function MissionTeamsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: USE_CASES_NAV.label, href: '/#audiences' }}
          name="Mission teams"
          title="Follow up with every new believer from your outreach."
          subtitle="We're building injily to help mission and outreach teams make sure every new believer they meet has someone following up."
        />
        <ProductFeatures title="What we're building" points={POINTS} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';

export const metadata: Metadata = {
  title: 'Missions',
  description:
    'Plan missions and outreach events with a location and schedule, assign missioners, register converts against the mission they came from, and set goals.',
};

const POINTS: ProductPoint[] = [
  {
    icon: 'location_on',
    title: 'Missions and outreach events',
    body: 'Set up each mission or outreach event with its location and schedule, so the whole team knows where and when.',
  },
  {
    icon: 'groups',
    title: 'Missioners on every mission',
    body: 'Assign missioners to a mission, so everyone knows who is going and who to call.',
  },
  {
    icon: 'how_to_reg',
    title: 'Converts linked to their mission',
    body: 'Register each new believer against the mission they came from, and see the fruit of every outreach.',
  },
  {
    icon: 'flag',
    title: 'Goals with a target count',
    body: 'Set goals with a target count, daily, weekly or monthly, and follow your progress towards each one.',
  },
];

const MISSIONERS = ['SO', 'EN', 'JT'];

/** The hero picture: one mission's card with its location, schedule and missioners, and a goal. */
function MissionsVisual() {
  return (
    <div className="space-y-4 rounded-3xl border border-border bg-background-light p-4 sm:p-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="font-bold text-text">Riverside outreach</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">location_on</span>
            Riverside market square
          </li>
          <li className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">event_repeat</span>
            Saturday mornings
          </li>
        </ul>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <ul className="flex -space-x-2">
            {MISSIONERS.map((initials) => (
              <li
                key={initials}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-primary/10 text-sm font-bold text-primary"
              >
                {initials}
              </li>
            ))}
          </ul>
          <span className="flex items-center gap-1 text-sm font-semibold text-muted">
            <span className="material-symbols-outlined text-lg text-success">how_to_reg</span>
            Converts registered here
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-bold text-text">
            <span className="material-symbols-outlined text-xl text-accent">flag</span>
            New converts goal
          </p>
          <span className="rounded-full border border-border px-3 py-1 text-sm font-semibold text-muted">Monthly</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-background-light">
          <div className="h-full w-3/5 rounded-full bg-primary" />
        </div>
        <p className="mt-2 text-sm text-muted">Progress towards the target count</p>
      </div>
    </div>
  );
}

export default function MissionsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: 'Product', href: '/#features' }}
          name="Missions"
          title="Every outreach, organized and remembered."
          subtitle="Plan missions and outreach events, send your missioners, and link every new believer to the mission where they responded."
          visual={<MissionsVisual />}
          visualLabel="A mission in injily: the Riverside outreach, at the market square on Saturday mornings, with three assigned missioners and converts registered against it, above a monthly new converts goal with a progress bar towards its target count."
        />
        <ProductFeatures
          title="From the plan to the fruit"
          subtitle="Everything about a mission, from where it happens to who came to faith."
          points={POINTS}
        />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

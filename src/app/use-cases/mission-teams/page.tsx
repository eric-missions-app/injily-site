import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductHero from '@/components/ProductHero';
import UseCaseSection from '@/components/UseCaseSection';
import { USE_CASES_NAV } from '@/lib/site';

export const metadata: Metadata = {
  title: 'For mission teams',
  description:
    'For outreach and mission-trip teams: organize missions, assign the team, register converts per mission, track goals, and hand converts on to local churches.',
};

const MISSIONERS = ['SO', 'EN', 'JT'];

/** The hero picture: one mission with its team and goal, and a convert handed on to a local church. */
function MissionTeamsVisual() {
  return (
    <div className="space-y-4 rounded-3xl border border-border bg-background-light p-4 sm:p-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-bold text-text">Lakeside mission week</p>
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
        </div>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          <span className="material-symbols-outlined text-lg text-primary">location_on</span>
          Lakeside town centre
        </p>
        <div className="mt-5 border-t border-border pt-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-text">
            <span className="material-symbols-outlined text-lg text-accent">flag</span>
            New converts goal
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background-light">
            <div className="h-full w-2/3 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-5">
        <span className="material-symbols-outlined text-2xl text-success">swap_horiz</span>
        <div>
          <p className="font-semibold text-text">Grace M.</p>
          <p className="text-sm text-muted">Handed on to Lakeside Baptist Church</p>
        </div>
      </div>
    </div>
  );
}

export default function MissionTeamsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: USE_CASES_NAV.label, href: '/#audiences' }}
          name="Mission teams"
          title="From the mission field to a local church."
          subtitle="For outreach and mission-trip teams: organize every mission, send the right team, register the converts each one brings, and hand them on to a local church that will keep walking with them."
          visual={<MissionTeamsVisual />}
          visualLabel="A mission team in injily: the Lakeside mission week at the town centre with three assigned missioners and a new converts goal with a progress bar, above a convert, Grace M., handed on to Lakeside Baptist Church."
        />
        <UseCaseSection
          tone="light"
          icon="location_on"
          title="Organize missions and assign the team"
          body="Set up each mission or outreach event with where and when it happens, and put the right missioners on it."
          points={[
            'A location and a schedule for every mission and outreach event.',
            'Assign missioners, so everyone knows who is going and who to call.',
            'Bring your whole team in at once from a CSV or Excel file.',
          ]}
          links={[
            { label: 'Missions', href: '/product/missions' },
            { label: 'Mentoring', href: '/product/mentoring' },
          ]}
        />
        <UseCaseSection
          tone="default"
          icon="flag"
          title="Register converts per mission and track your goals"
          body="Every new believer is registered against the mission they came from, so you see the fruit of each outreach and how close you are to your goals."
          points={[
            'Register converts on the spot, linked to their mission.',
            'Set goals with a target count, daily, weekly or monthly.',
            'Follow your progress towards each goal.',
          ]}
          links={[
            { label: 'Missions', href: '/product/missions' },
            { label: 'Convert tracking', href: '/product/convert-tracking' },
          ]}
        />
        <UseCaseSection
          tone="light"
          icon="church"
          title="Hand converts on to local churches"
          body="When the mission ends, the follow-up doesn't. Hand each convert on to a missioner at a local church, with everything you know about them."
          points={[
            'Reassign a convert to a missioner at a local church.',
            'Their notes and status history go with them.',
            'Follow-up tasks keep the next step clear.',
          ]}
          links={[
            { label: 'Mentoring', href: '/product/mentoring' },
            { label: 'Follow-up', href: '/product/follow-up' },
          ]}
        />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

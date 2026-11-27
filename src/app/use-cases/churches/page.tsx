import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductHero from '@/components/ProductHero';
import UseCaseSection from '@/components/UseCaseSection';
import { USE_CASES_NAV } from '@/lib/site';

export const metadata: Metadata = {
  title: 'For churches',
  description:
    'For pastors and follow-up leaders: give every decision at a service an owner, see who is slipping before they are gone, and show your church branding to the team.',
};

const DECISIONS = [
  { name: 'Grace M.', owner: 'SO', status: 'Followed up', icon: 'task_alt', tone: 'text-success' },
  { name: 'Daniel K.', owner: 'EN', status: 'Visit on Thursday', icon: 'calendar_month', tone: 'text-primary' },
  { name: 'Ruth A.', owner: 'JT', status: 'Needs attention', icon: 'notification_important', tone: 'text-danger' },
];

/** The hero picture: the decisions from one Sunday service, each with its owner and where they stand. */
function ChurchesVisual() {
  return (
    <div className="rounded-3xl border border-border bg-background-light p-4 sm:p-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
            <span className="material-symbols-outlined text-2xl">church</span>
          </span>
          <div>
            <p className="font-bold text-text">Hope Community Church</p>
            <p className="text-sm text-muted">Sunday service decisions</p>
          </div>
        </div>
        <ul className="mt-2 divide-y divide-border">
          {DECISIONS.map((decision) => (
            <li key={decision.name} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {decision.owner}
                </span>
                <p className="font-semibold text-text">{decision.name}</p>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-muted">
                <span className={`material-symbols-outlined text-lg ${decision.tone}`}>{decision.icon}</span>
                {decision.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ChurchesPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: USE_CASES_NAV.label, href: '/#audiences' }}
          name="Churches"
          title="Every decision at your service, followed up."
          subtitle="For pastors and follow-up leaders: give every new believer an owner, see who's slipping before they're gone, and bring your whole team along under your church's name."
          visual={<ChurchesVisual />}
          visualLabel="A church in injily: Hope Community Church's decisions from a Sunday service, three new believers each with the initials of the missioner who owns their follow-up. One has been followed up, one has a visit on Thursday, and one needs attention."
        />
        <UseCaseSection
          tone="light"
          icon="person_add"
          title="Every decision gets an owner"
          body="Register each new believer right after the service and pair them with a missioner, so nobody leaves the building without someone who will call."
          points={[
            'Register new believers right after the service, with their contact details and notes.',
            'Pair each one with a missioner who walks with them.',
            'Give every next step a task with a due date and a priority.',
          ]}
          links={[
            { label: 'Mentoring', href: '/product/mentoring' },
            { label: 'Follow-up', href: '/product/follow-up' },
          ]}
        />
        <UseCaseSection
          tone="default"
          icon="notification_important"
          title="See who's slipping before they're gone"
          body="Anyone who has disengaged, or is still pending 14 days after registering, shows up where you can act on them, long before they've quietly left."
          points={[
            'Follow every convert from New believer to Growing to Mature.',
            'One needs attention list for anyone disengaged or still pending.',
            'Dashboards for your pipeline, growth over time and task completion.',
          ]}
          links={[
            { label: 'Convert tracking', href: '/product/convert-tracking' },
            { label: 'Insights', href: '/product/insights' },
          ]}
        />
        <UseCaseSection
          tone="light"
          icon="palette"
          title="Your church, your branding"
          body="Your team works under your church's name: your logo and theme color are what every missioner sees."
          points={[
            'Show your church logo and theme color to the whole team.',
            'Send messages to your missioners.',
            "Only your church's team can see your converts.",
          ]}
          links={[{ label: 'Insights', href: '/product/insights' }]}
        />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

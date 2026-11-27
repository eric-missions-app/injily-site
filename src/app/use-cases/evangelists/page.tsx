import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductHero from '@/components/ProductHero';
import UseCaseSection from '@/components/UseCaseSection';
import { USE_CASES_NAV } from '@/lib/site';

export const metadata: Metadata = {
  title: 'For evangelists',
  description:
    'For evangelists and missioners: register converts on the spot, keep all your converts in one list across churches, and never miss a follow-up.',
};

const CONVERTS = [
  { name: 'Grace M.', church: 'Hope Community Church', next: 'Call on Tuesday' },
  { name: 'Daniel K.', church: 'Riverside Fellowship', next: 'Visit on Thursday' },
  { name: 'Ruth A.', church: 'Hope Community Church', next: 'Discipleship class' },
];

/** The hero picture: one missioner's converts, from two churches, in one list with each one's next step. */
function EvangelistsVisual() {
  return (
    <div className="rounded-3xl border border-border bg-background-light p-4 sm:p-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
          <p className="font-bold text-text">My converts</p>
          <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm font-bold text-on-primary">
            <span className="material-symbols-outlined text-lg">person_add</span>
            Register
          </span>
        </div>
        <ul className="mt-2 divide-y divide-border">
          {CONVERTS.map((convert) => (
            <li key={convert.name} className="py-3">
              <p className="font-semibold text-text">{convert.name}</p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg text-primary">church</span>
                  {convert.church}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg text-accent">notifications</span>
                  {convert.next}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function EvangelistsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: USE_CASES_NAV.label, href: '/#audiences' }}
          name="Evangelists"
          title="Every convert you meet, never forgotten."
          subtitle="For evangelists and missioners: register new believers where you meet them, keep them all in one list whichever church they belong to, and stay on top of every follow-up."
          visual={<EvangelistsVisual />}
          visualLabel="A missioner's converts in injily: a My converts list with a Register button and three new believers from two churches, Hope Community Church and Riverside Fellowship, each with their next follow-up."
        />
        <UseCaseSection
          tone="light"
          icon="how_to_reg"
          title="Register converts on the spot"
          body="Right after an event or a conversation, record each new believer while the details are fresh, from your phone's browser."
          points={[
            'Name, contact details, preferred meeting time, location and notes.',
            'Every convert starts as a New believer in the discipleship pipeline.',
            "Nothing to install, and converts never need an account.",
          ]}
          links={[{ label: 'Convert tracking', href: '/product/convert-tracking' }]}
        />
        <UseCaseSection
          tone="default"
          icon="diversity_3"
          title="All your converts in one list, across churches"
          body="Serve more than one church and still see everyone you're walking with in one place, whichever church each one belongs to."
          points={[
            'One list of every convert you are walking with.',
            'Their notes and status history stay with them.',
            'Each church sees only its own converts.',
          ]}
          links={[{ label: 'Mentoring', href: '/product/mentoring' }]}
        />
        <UseCaseSection
          tone="light"
          icon="calendar_month"
          title="Never miss a follow-up"
          body="Every next step is a task with a due date, and every meeting is on your calendar with a reminder."
          points={[
            'Follow-up tasks with a due date and a priority, linked to each convert.',
            'Meetings, prayer and discipleship classes on one calendar, one-off or repeating.',
            'Reminders, so nothing on the calendar is missed.',
          ]}
          links={[{ label: 'Follow-up', href: '/product/follow-up' }]}
        />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

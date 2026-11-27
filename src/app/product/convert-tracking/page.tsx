import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';

export const metadata: Metadata = {
  title: 'Convert tracking',
  description:
    'Register new believers right after an event or service, follow them from New believer to Growing to Mature, and see who needs attention.',
};

const STAGES = ['New believer', 'Growing', 'Mature'];

const POINTS: ProductPoint[] = [
  {
    icon: 'person_add',
    title: 'Register converts on the spot',
    body: 'Right after an event or service, record each new believer: name, contact details, preferred meeting time, location and notes.',
  },
  {
    icon: 'trending_up',
    title: 'The discipleship pipeline',
    body: 'Every convert moves through three stages: New believer, Growing and Mature. You always know where each person stands.',
  },
  {
    icon: 'history',
    title: 'Notes and status history',
    body: 'Each convert keeps their own notes and a history of every status change, so whoever follows up next has the whole story.',
  },
  {
    icon: 'notification_important',
    title: 'The needs attention list',
    body: 'Anyone who has disengaged, or is still pending 14 days after registering, shows up on one list, so nobody slips away quietly.',
  },
];

/** The hero picture: one convert's card with the pipeline and history, and the needs attention list. */
function ConvertVisual() {
  return (
    <div className="space-y-4 rounded-3xl border border-border bg-background-light p-4 sm:p-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
            GM
          </span>
          <div>
            <p className="font-bold text-text">Grace M.</p>
            <p className="text-sm text-muted">Registered after Sunday service</p>
          </div>
        </div>
        <ol className="mt-5 flex flex-wrap items-center gap-2 text-sm font-bold">
          {STAGES.map((stage, index) => (
            <li key={stage} className="flex items-center gap-2">
              {index > 0 && (
                <span className="material-symbols-outlined text-lg text-muted">arrow_forward</span>
              )}
              <span
                className={
                  stage === 'Growing'
                    ? 'rounded-full bg-primary px-3 py-1 text-on-primary'
                    : 'rounded-full border border-border px-3 py-1 text-muted'
                }
              >
                {stage}
              </span>
            </li>
          ))}
        </ol>
        <ul className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-muted">
          <li className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">history</span>
            Moved from New believer to Growing
          </li>
          <li className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">sticky_note_2</span>
            Prefers evenings, would like to join a small group
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="flex items-center gap-2 font-bold text-text">
          <span className="material-symbols-outlined text-xl text-accent">notification_important</span>
          Needs attention
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center justify-between gap-3">
            <span className="text-text">Daniel K.</span>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-semibold text-text">Pending 14+ days</span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span className="text-text">Ruth A.</span>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-semibold text-text">Disengaged</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function ConvertTrackingPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: 'Product', href: '/#features' }}
          name="Convert tracking"
          title="Follow every new believer, from the first decision on."
          subtitle="Register converts the moment they respond, watch them grow from New believer to Mature, and see straight away who needs attention."
          visual={<ConvertVisual />}
          visualLabel="A convert's card in injily: Grace M., registered after Sunday service, at the Growing stage, with a status change and a note, above a needs attention list of one convert pending for 14 days and one who has disengaged."
        />
        <ProductFeatures
          title="Nobody gets lost after they respond"
          subtitle="Everything you need to know about each convert, in one place."
          points={POINTS}
        />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

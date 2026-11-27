import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Dashboards for your convert pipeline, growth over time, task completion, converts needing attention and top missioners, plus team messages and church branding.',
};

const POINTS: ProductPoint[] = [
  {
    icon: 'view_kanban',
    title: 'The convert pipeline',
    body: 'See how many converts are at each stage, from New believer to Growing to Mature.',
  },
  {
    icon: 'trending_up',
    title: 'Convert growth over time',
    body: 'Watch how your church grows, week by week and month by month.',
  },
  {
    icon: 'task_alt',
    title: 'Task completion',
    body: 'Know whether follow-up tasks are getting done, and where the team needs a hand.',
  },
  {
    icon: 'notification_important',
    title: 'Converts needing attention',
    body: 'The converts who have disengaged or are still pending, on the dashboard where you can act on them.',
  },
  {
    icon: 'leaderboard',
    title: 'Top missioners',
    body: 'See which missioners are most active in discipleship, so you can thank them and learn from them.',
  },
  {
    icon: 'palette',
    title: 'Messages and church branding',
    body: 'Send messages to your missioners, and show your church logo and theme color to the whole team.',
  },
];

/** Bar heights for the growth chart: an illustrative upward shape, not data. */
const GROWTH_BARS = ['h-1/4', 'h-2/5', 'h-1/3', 'h-1/2', 'h-3/5', 'h-4/5', 'h-full'];

const PIPELINE = [
  { stage: 'New believer', width: 'w-full' },
  { stage: 'Growing', width: 'w-2/3' },
  { stage: 'Mature', width: 'w-1/3' },
];

const TOP_MISSIONERS = ['Samuel O.', 'Esther N.'];

/** The hero picture: a church-branded dashboard with growth, the pipeline and top missioners. */
function InsightsVisual() {
  return (
    <div className="space-y-4 rounded-3xl border border-border bg-background-light p-4 sm:p-6">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
          <span className="material-symbols-outlined text-xl">church</span>
        </span>
        <p className="font-bold text-text">Grace Chapel dashboard</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-text">
            <span className="material-symbols-outlined text-lg text-primary">trending_up</span>
            Convert growth
          </p>
          <div className="mt-4 flex h-24 items-end gap-2">
            {GROWTH_BARS.map((height, index) => (
              <div key={index} className={`${height} flex-1 rounded-t-md bg-primary/70`} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-text">
            <span className="material-symbols-outlined text-lg text-primary">view_kanban</span>
            Pipeline
          </p>
          <ul className="mt-4 space-y-3 text-xs text-muted">
            {PIPELINE.map((row) => (
              <li key={row.stage}>
                {row.stage}
                <div className="mt-1 h-2 rounded-full bg-background-light">
                  <div className={`${row.width} h-full rounded-full bg-primary`} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="flex items-center gap-2 font-bold text-text">
          <span className="material-symbols-outlined text-xl text-accent">leaderboard</span>
          Top missioners
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {TOP_MISSIONERS.map((name) => (
            <li key={name} className="flex items-center justify-between gap-3">
              <span className="text-text">{name}</span>
              <span className="rounded-full border border-border px-3 py-1 font-semibold text-muted">
                Discipleship activity
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: 'Product', href: '/#features' }}
          name="Insights"
          title="See how your church is growing."
          subtitle="Dashboards that show where every convert stands, how the team is keeping up, and who needs attention next, under your own church's logo and colors."
          visual={<InsightsVisual />}
          visualLabel="A church-branded dashboard in injily for Grace Chapel: a convert growth chart rising over time, the pipeline from New believer to Growing to Mature, and a list of top missioners by discipleship activity."
        />
        <ProductFeatures
          title="Clear answers for the people who lead"
          subtitle="The questions leaders ask most, answered on one dashboard."
          points={POINTS}
        />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

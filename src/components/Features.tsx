import Link from 'next/link';
import FadeIn from '@/components/FadeIn';

const FEATURES = [
  {
    icon: 'person_add',
    title: 'Convert Tracking',
    href: '/product/convert-tracking',
    body: 'Record and follow every new believer from their first decision to full discipleship. Keep notes, track progress, and never lose anyone.',
  },
  {
    icon: 'task_alt',
    title: 'Task Management',
    href: '/product/follow-up',
    body: 'Assign follow-up tasks, set deadlines, and track completion. Make sure every convert receives timely attention and care.',
  },
  {
    icon: 'diversity_3',
    title: 'Mentor Assignment',
    href: '/product/mentoring',
    body: 'Pair new believers with experienced mentors. Build relationships that nurture spiritual growth within your church community.',
  },
  {
    icon: 'insights',
    title: 'Analytics & Insights',
    href: '/product/insights',
    body: 'See how your church is growing with real-time dashboards. Track conversion trends, task completion rates, and mission impact.',
  },
  {
    icon: 'public',
    title: 'Mission Campaigns',
    href: '/product/missions',
    body: 'Organize outreach events and mission trips. Coordinate your team, track results, and measure the fruit of every effort.',
  },
  {
    icon: 'calendar_month',
    title: 'Calendar & Planner',
    href: '/product/follow-up',
    body: 'Schedule follow-up meetings, prayer sessions, and discipleship classes. Stay organized so nothing falls through the cracks.',
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            Everything your ministry needs
          </h2>
          <p className="mt-4 text-lg text-muted">
            Purpose-built for churches and evangelism teams who take discipleship seriously.
          </p>
        </FadeIn>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <li key={feature.title}>
              <FadeIn
                delay={(index % 3) * 0.1}
                className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6"
              >
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl text-primary"
                >
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-text">{feature.title}</h3>
                <p className="mt-2 flex-1 text-muted">{feature.body}</p>
                <Link
                  href={feature.href}
                  className="mt-4 inline-flex items-center gap-1 self-start rounded-md text-sm font-bold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Learn more<span className="sr-only"> about {feature.title}</span>
                  <span aria-hidden="true" className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

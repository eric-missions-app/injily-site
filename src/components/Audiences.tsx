import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import IconTile from '@/components/IconTile';

const AUDIENCES = [
  {
    icon: 'church',
    title: 'Churches & pastors',
    href: '/use-cases/churches',
    body: 'Make sure every person who responds at your church is followed up.',
  },
  {
    icon: 'campaign',
    title: 'Evangelists',
    href: '/use-cases/evangelists',
    body: 'Make sure someone on your team follows up with every person who responds when you share the gospel.',
  },
  {
    icon: 'groups',
    title: 'Mission & outreach teams',
    href: '/use-cases/mission-teams',
    body: 'Make sure every new believer from your outreach has someone on your team following up.',
  },
];

export default function Audiences() {
  return (
    <section id="audiences" className="scroll-mt-20 bg-background-light">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">Who it&apos;s for</h2>
          <p className="mt-4 text-lg text-muted">For everyone who meets new believers and wants to see each one followed up.</p>
        </FadeIn>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {AUDIENCES.map((audience, index) => (
            <li key={audience.href}>
              <FadeIn delay={index * 0.1} className="h-full">
                <Link
                  href={audience.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <IconTile icon={audience.icon} />
                  <h3 className="mt-4 text-lg font-bold text-text">{audience.title}</h3>
                  <p className="mt-2 flex-1 text-muted">{audience.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:text-primary-hover">
                    Learn more
                    <span className="flex text-lg">
                      <span aria-hidden="true" className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </span>
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

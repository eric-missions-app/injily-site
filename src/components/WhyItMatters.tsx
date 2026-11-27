import FadeIn from '@/components/FadeIn';
import IconTile from '@/components/IconTile';

const POINTS = [
  {
    icon: 'person_search',
    title: "Nobody knows who's responsible",
    body: 'The evangelist assumes the church will call. The church assumes the evangelist already has. So nobody does.',
  },
  {
    icon: 'sticky_note_2',
    title: 'Notes live on phones and paper',
    body: "Names end up on decision cards, in text threads and on a volunteer's phone, where nobody else can find them.",
  },
  {
    icon: 'visibility_off',
    title: "Leaders can't see who's slipping",
    body: 'Without a shared picture, pastors only hear that someone has drifted long after it was easy to reach them.',
  },
];

export default function WhyItMatters() {
  return (
    <section className="bg-background-light">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Why follow-up matters</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            A decision is a beginning, not the end.
          </h2>
          <p className="mt-6 text-lg text-muted">
            Someone gives their life to Christ at an outreach event or a Sunday service. They fill in a card, shake a
            few hands and go home. Then the week gets busy, nobody calls, and slowly they drift away. It isn&apos;t a
            lack of love. It&apos;s the lack of a way to follow up.
          </p>
        </FadeIn>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {POINTS.map((point, index) => (
            <li key={point.title}>
              <FadeIn delay={index * 0.1} className="h-full rounded-2xl border border-border bg-surface p-6">
                <IconTile icon={point.icon} />
                <h3 className="mt-4 text-lg font-bold text-text">{point.title}</h3>
                <p className="mt-2 text-muted">{point.body}</p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import FadeIn from '@/components/FadeIn';

const FEATURES = [
  {
    icon: 'person_add',
    title: 'Keep track of every new believer',
    body: 'injily will keep track of each person after they respond, so nobody slips through the cracks.',
  },
  {
    icon: 'how_to_reg',
    title: 'Someone responsible for each person',
    body: 'injily will make sure someone is responsible for following up with every new believer.',
  },
  {
    icon: 'person_search',
    title: 'See who needs attention',
    body: 'injily will help you see who needs attention, so you know who to reach out to.',
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">What we&apos;re building</h2>
          <p className="mt-4 text-lg text-muted">
            We&apos;re building injily to help churches, evangelists and mission teams follow up with new believers.
          </p>
        </FadeIn>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <li key={feature.title}>
              <FadeIn delay={index * 0.1} className="h-full rounded-2xl border border-border bg-surface p-6">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl text-primary"
                >
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-text">{feature.title}</h3>
                <p className="mt-2 text-muted">{feature.body}</p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

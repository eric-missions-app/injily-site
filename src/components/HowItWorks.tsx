import FadeIn from '@/components/FadeIn';

const STEPS = [
  {
    number: '01',
    title: 'Register a convert',
    body: 'Log new believers right after an event or service with name, contact info, and notes.',
  },
  {
    number: '02',
    title: 'Assign & schedule',
    body: 'Match each convert with a mentor, create follow-up tasks, and set reminders.',
  },
  {
    number: '03',
    title: 'Track & grow',
    body: 'Monitor progress in the dashboard, celebrate milestones, and see your church flourish.',
  },
];

const STAGES = ['New believer', 'Growing', 'Mature'];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-background-light">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">How it works</h2>
          <p className="mt-4 text-lg text-muted">From first contact to mature disciple — every step is covered.</p>
        </FadeIn>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.number}>
              <FadeIn delay={index * 0.1} className="h-full rounded-2xl border border-border bg-surface p-6">
                <span aria-hidden="true" className="text-4xl font-extrabold text-primary">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-bold text-text">
                  <span className="sr-only">Step {step.number}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-muted">{step.body}</p>
              </FadeIn>
            </li>
          ))}
        </ol>

        <FadeIn className="mt-12">
          <h3 className="text-center text-sm font-bold uppercase tracking-wider text-muted">
            The discipleship pipeline
          </h3>
          <ol className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {STAGES.map((stage, index) => (
              <li key={stage} className="flex flex-col items-center gap-3 sm:flex-row">
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined rotate-90 text-2xl text-muted sm:rotate-0"
                  >
                    arrow_forward
                  </span>
                )}
                <span className="rounded-full border border-border bg-surface px-5 py-2 font-bold text-text">
                  {stage}
                </span>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </section>
  );
}

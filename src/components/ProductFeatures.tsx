import FadeIn from '@/components/FadeIn';

export type ProductPoint = {
  /** A Material Symbols name; add it to `icon_names` in `src/app/layout.tsx`. */
  icon: string;
  title: string;
  body: string;
};

type ProductFeaturesProps = {
  title: string;
  subtitle?: string;
  /** 3 to 6 points. */
  points: ProductPoint[];
};

/** A product or use-case page's grid of 3–6 points, each with an icon, a title and a line or two. */
export default function ProductFeatures({ title, subtitle, points }: ProductFeaturesProps) {
  // Four points read better as two rows of two than as three and one.
  const columns = points.length === 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="bg-background-light">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
        </FadeIn>

        <ul className={`mt-12 grid gap-6 ${columns}`}>
          {points.map((point, index) => (
            <li key={point.title}>
              <FadeIn delay={(index % 3) * 0.1} className="h-full rounded-2xl border border-border bg-surface p-6">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl text-primary"
                >
                  {point.icon}
                </span>
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

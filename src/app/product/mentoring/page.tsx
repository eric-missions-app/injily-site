import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';

export const metadata: Metadata = {
  title: 'Mentoring',
  description:
    'Pair every new believer with a missioner, reassign with the history kept, and add your missioners one by one or from a CSV or Excel file.',
};

const POINTS: ProductPoint[] = [
  {
    icon: 'diversity_3',
    title: 'A missioner for every convert',
    body: 'Pair each new believer with a missioner who walks with them, so every convert knows who to turn to.',
  },
  {
    icon: 'swap_horiz',
    title: 'Reassign without losing the story',
    body: 'Hand a convert to a different missioner whenever you need to. Their notes and history stay with them.',
  },
  {
    icon: 'church',
    title: 'All their converts, across churches',
    body: 'A missioner sees every convert they are walking with in one place, whichever church each one belongs to.',
  },
  {
    icon: 'upload_file',
    title: 'Add missioners one by one, or import a file',
    body: 'Add a missioner by hand, or import a CSV or Excel file with email, first_name and last_name. Each one gets their sign-in by email.',
  },
];

const CONVERTS = [
  { name: 'Grace M.', church: 'Grace Chapel' },
  { name: 'Daniel K.', church: 'Hope Fellowship' },
];

/** The hero picture: a missioner's converts across churches, a reassignment, and a missioner import. */
function MentoringVisual() {
  return (
    <div className="space-y-4 rounded-3xl border border-border bg-background-light p-4 sm:p-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
            SO
          </span>
          <div>
            <p className="font-bold text-text">Samuel O.</p>
            <p className="text-sm text-muted">Missioner</p>
          </div>
        </div>
        <ul className="mt-5 space-y-2 text-sm">
          {CONVERTS.map((convert) => (
            <li key={convert.name} className="flex items-center justify-between gap-3">
              <span className="text-text">{convert.name}</span>
              <span className="flex items-center gap-1 rounded-full border border-border px-3 py-1 font-semibold text-muted">
                <span className="material-symbols-outlined text-lg">church</span>
                {convert.church}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm text-muted">
          <span className="material-symbols-outlined text-lg text-primary">swap_horiz</span>
          Ruth A. reassigned from Esther N., history kept
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="flex items-center gap-2 font-bold text-text">
          <span className="material-symbols-outlined text-xl text-primary">upload_file</span>
          Import missioners
        </p>
        <p className="mt-3 rounded-xl border border-border bg-background-light px-3 py-2 font-mono text-sm text-muted">
          email, first_name, last_name
        </p>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
          <span className="material-symbols-outlined text-lg text-success">mail</span>
          Sign-in sent by email to each new missioner
        </p>
      </div>
    </div>
  );
}

export default function MentoringPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: 'Product', href: '/#features' }}
          name="Mentoring"
          title="Nobody walks the road alone."
          subtitle="Pair every new believer with a missioner, keep the history when you reassign, and bring your whole team on board from a single file."
          visual={<MentoringVisual />}
          visualLabel="A missioner's view in injily: Samuel O. with two converts from different churches and a reassignment that kept the convert's history, above a missioner import from a file with email, first_name and last_name columns, where each new missioner gets their sign-in by email."
        />
        <ProductFeatures
          title="The right person beside every convert"
          subtitle="Mentoring that holds together, even when your team changes."
          points={POINTS}
        />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

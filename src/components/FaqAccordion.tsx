'use client';

import { useId, useState } from 'react';
import type { FaqEntry } from '@/content/faq';

type FaqAccordionProps = {
  entries: FaqEntry[];
  /** The questions' heading level: one below the section's heading (`h3` under an `h2`, `h2` under the page's `h1`). */
  headingLevel: 'h2' | 'h3';
};

/** FAQ entries as an accordion, one open at a time. Real buttons with `aria-expanded`, so Tab and Enter work. */
export default function FaqAccordion({ entries, headingLevel: Heading }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
      {entries.map((entry, index) => {
        const open = openIndex === index;
        const buttonId = `${baseId}-q${index}`;
        const panelId = `${baseId}-a${index}`;
        return (
          <li key={entry.question}>
            <Heading>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left text-lg font-bold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {entry.question}
                <span
                  aria-hidden="true"
                  className={`material-symbols-outlined text-2xl text-muted transition-transform ${open ? 'rotate-180' : ''}`}
                >
                  expand_more
                </span>
              </button>
            </Heading>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="px-6 pb-5">
              <p className="text-muted">{entry.answer}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import FadeIn from '@/components/FadeIn';
import { FAQ } from '@/content/faq';
import { FAQ_LINK } from '@/lib/site';

const PREVIEW = FAQ.slice(0, 4);

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default function FaqPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section className="bg-background-light">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">Frequently asked questions</h2>
        </FadeIn>

        <ul className="mt-12 divide-y divide-border rounded-2xl border border-border bg-surface">
          {PREVIEW.map((entry, index) => {
            const open = openIndex === index;
            const buttonId = `${baseId}-q${index}`;
            const panelId = `${baseId}-a${index}`;
            return (
              <li key={entry.question}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className={`flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left text-lg font-bold text-text ${focusRing}`}
                  >
                    {entry.question}
                    <span
                      aria-hidden="true"
                      className={`material-symbols-outlined text-2xl text-muted transition-transform ${open ? 'rotate-180' : ''}`}
                    >
                      expand_more
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="px-6 pb-5">
                  <p className="text-muted">{entry.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href={FAQ_LINK.href}
            className={`inline-flex items-center gap-1 rounded-md font-bold text-primary hover:text-primary-hover ${focusRing}`}
          >
            See all questions
            <span aria-hidden="true" className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

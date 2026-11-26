import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'What injily collects when you fill in a form, why, who can see it, how long we keep it, and how to see, correct or delete it.',
};

const LAST_UPDATED = { iso: '2026-11-25', label: 'November 25, 2026' };

const linkClass =
  'rounded-sm font-semibold text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-background-light">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl">Privacy policy</h1>
            <p className="mt-4 text-lg text-muted">
              This page explains, in plain language, what we collect when you fill in a form on injily.com, why we
              collect it, and what you can ask us to do with it.
            </p>
            <p className="mt-6 text-sm text-muted">
              Last updated: <time dateTime={LAST_UPDATED.iso}>{LAST_UPDATED.label}</time>
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-3xl space-y-12 px-4 py-16 text-text sm:px-6 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">What we collect</h2>
              <p className="mt-4">
                We only collect what you type into our forms: the &ldquo;Get early access&rdquo; form and the contact
                form. That is:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  <strong>Always:</strong> your first name, last name, email address and country.
                </li>
                <li>
                  <strong>If you give them:</strong> your phone number, city, organization name and type, your role,
                  and your message.
                </li>
                <li>
                  <strong>Depending on the form:</strong> what you&rsquo;re interested in (early access form) or the
                  subject of your question (contact form).
                </li>
                <li>
                  <strong>Your consent:</strong> that you ticked the box agreeing to this policy, and when you did.
                </li>
                <li>
                  <strong>The page you sent the form from</strong>, so we know what you were reading about.
                </li>
                <li>
                  <strong>A scrambled version of your IP address.</strong> To stop spam, we limit how many forms can
                  be sent from one place in a short time. We never store your IP address itself, only a salted hash
                  of it: a one-way code that can&rsquo;t be turned back into the address.
                </li>
              </ul>
              <p className="mt-4">
                The site sets no tracking cookies and we don&rsquo;t use advertising trackers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">Why we collect it</h2>
              <p className="mt-4">
                To follow up on your request: to answer your question, or to get in touch about early access to
                injily. We send you one email confirming we received your form. We don&rsquo;t sell your details, and
                we don&rsquo;t add you to a mailing list you didn&rsquo;t ask for.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">Who can see it</h2>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  <strong>The injily team only.</strong> Your details are in a private, signed-in area that only our
                  team can open.
                </li>
                <li>
                  <strong>Resend</strong> sends our emails: the note that tells our team about your form, and the
                  confirmation we send you. Those emails include the details you entered.
                </li>
                <li>
                  <strong>Neon</strong> stores our database, and <strong>Vercel</strong> hosts the site. They keep
                  your data on our behalf and don&rsquo;t use it for anything else.
                </li>
              </ul>
              <p className="mt-4">We don&rsquo;t share your details with anyone else.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">How long we keep it</h2>
              <p className="mt-4">
                We keep your details while we&rsquo;re following up on your request or working with you. When
                that&rsquo;s over, or whenever you ask, we delete them. The scrambled IP code is only used to spot
                spam within a few minutes of a form being sent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your rights</h2>
              <p className="mt-4">Wherever you live, you can ask us to:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  <strong>See</strong> the details we hold about you.
                </li>
                <li>
                  <strong>Correct</strong> anything that&rsquo;s wrong or out of date.
                </li>
                <li>
                  <strong>Delete</strong> your details completely.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">How to ask</h2>
              <p className="mt-4">
                Send us a message through the{' '}
                <Link href="/contact" className={linkClass}>
                  contact form
                </Link>{' '}
                and tell us what you&rsquo;d like: to see, correct or delete your details. Use the same email address
                you gave us before, so we can find your record. We&rsquo;ll reply to that address to confirm
                it&rsquo;s you, and then do what you asked.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

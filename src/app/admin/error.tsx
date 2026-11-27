'use client';

/**
 * Shown in place of an admin page when rendering it fails (for example, the database is unreachable). The admin
 * header and nav stay in place. Edits made through forms show their own one-line errors and don't land here.
 */
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-xl font-bold text-text">This page couldn&apos;t load</h1>
      <p className="mt-2 text-muted">Something went wrong reaching the database. Try again in a moment.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Try again
      </button>
    </div>
  );
}

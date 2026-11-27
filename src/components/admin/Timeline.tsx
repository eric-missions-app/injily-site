import { formatDateTime, statusLabel } from '@/lib/format';

type Entry = { id: string; kind: string; body: string | null; authorEmail: string | null; createdAt: Date };

/** A record's activity timeline as a card: kind, author and time, then the body. Newest first, as given. */
export default function Timeline({ activities }: { activities: Entry[] }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5" aria-labelledby="timeline">
      <h2 id="timeline" className="font-bold">Timeline</h2>
      {activities.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Nothing yet.</p>
      ) : (
        <ol className="mt-3 space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="border-l-2 border-border pl-3 text-sm">
              <p className="text-xs text-muted">
                {statusLabel(activity.kind)} · {activity.authorEmail ?? 'system'} ·{' '}
                <time dateTime={activity.createdAt.toISOString()}>{formatDateTime(activity.createdAt)}</time>
              </p>
              <p className="mt-1 whitespace-pre-wrap">{activity.body}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

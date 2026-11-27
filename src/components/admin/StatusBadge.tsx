import type { CaseStatus, LeadStatus } from '@/lib/validation/admin';
import { statusLabel } from '@/lib/format';

type Status = LeadStatus | CaseStatus;

// Tinted background and border; the text stays `text-text`, because accent and success as small text don't
// reach 4.5:1 on a light background.
const TONE: Record<Status, string> = {
  new: 'border-primary/40 bg-primary/10',
  open: 'border-primary/40 bg-primary/10',
  contacted: 'border-accent/40 bg-accent/10',
  in_progress: 'border-accent/40 bg-accent/10',
  qualified: 'border-accent/40 bg-accent/10',
  converted: 'border-success/40 bg-success/10',
  resolved: 'border-success/40 bg-success/10',
  closed: 'border-border bg-background-light',
};

/** A Lead's or Service Case's status as a small tinted pill. */
export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold text-text ${TONE[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}

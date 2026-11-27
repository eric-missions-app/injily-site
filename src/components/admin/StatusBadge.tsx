import type { CaseStatus, LeadStatus, OpportunityStage } from '@/lib/validation/admin';
import { statusLabel } from '@/lib/format';

export type Status = LeadStatus | CaseStatus | OpportunityStage;

// Tinted background and border; the text stays `text-text`, because accent and success as small text don't
// reach 4.5:1 on a light background.
const TONE: Record<Status, string> = {
  new: 'border-primary/40 bg-primary/10',
  open: 'border-primary/40 bg-primary/10',
  discovery: 'border-primary/40 bg-primary/10',
  contacted: 'border-accent/40 bg-accent/10',
  in_progress: 'border-accent/40 bg-accent/10',
  qualified: 'border-accent/40 bg-accent/10',
  onboarding: 'border-accent/40 bg-accent/10',
  converted: 'border-success/40 bg-success/10',
  resolved: 'border-success/40 bg-success/10',
  active: 'border-success/40 bg-success/10',
  closed: 'border-border bg-background-light',
  lost: 'border-border bg-background-light',
};

/** A Lead's or Service Case's status, or an Opportunity's stage, as a small tinted pill. */
export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold text-text ${TONE[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}

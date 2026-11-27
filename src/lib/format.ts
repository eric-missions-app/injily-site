/** `in_progress` → `in progress`, for statuses shown to people. */
export function statusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}

const dateTime = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

/** `25 Nov 2026, 14:05 UTC`. Always UTC, so the server and every admin see the same time. */
export function formatDateTime(date: Date): string {
  return `${dateTime.format(date)} UTC`;
}

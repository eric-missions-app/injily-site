import 'server-only';
import { escapeHtml, htmlDocument, rowsHtml, rowsText, type IntakeRecord, type RenderedEmail, type Row } from './shared';

/** The email to `TEAM_INBOX` about a new Lead or Service Case, with a link to it in `/admin`. */
export function teamNotification(record: IntakeRecord): RenderedEmail {
  const { input } = record;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
  const link = `${siteUrl}/admin/${record.kind === 'lead' ? 'leads' : 'cases'}/${record.id}`;

  const subject =
    record.kind === 'lead'
      ? `New lead: ${input.name}${input.organizationName ? ` (${input.organizationName})` : ''}`
      : `New service case: ${record.input.subject ?? input.name}`;

  const rows: Row[] = [
    ['Type', record.kind === 'lead' ? 'Lead' : 'Service case'],
    ...(record.kind === 'case' ? [['Subject', record.input.subject] as Row] : []),
    ['Name', input.name],
    ['Email', input.email],
    ['Phone', input.phone],
    ['Organization', input.organizationName],
    ['Message', input.message],
  ];

  return {
    subject,
    html: htmlDocument(
      `<p>${escapeHtml(subject)}</p>${rowsHtml(rows)}<p><a href="${escapeHtml(link)}">Open it in the admin</a></p>`,
    ),
    text: `${subject}\n\n${rowsText(rows)}\n\nOpen it in the admin: ${link}\n`,
  };
}

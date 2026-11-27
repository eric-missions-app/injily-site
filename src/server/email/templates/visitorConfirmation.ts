import 'server-only';
import { escapeHtml, htmlDocument, rowsHtml, rowsText, type IntakeRecord, type RenderedEmail, type Row } from './shared';

/** The confirmation to the visitor: thanks, someone will follow up, and a short summary of what they sent. */
export function visitorConfirmation(record: IntakeRecord): RenderedEmail {
  const { input } = record;
  const thanks = `Thanks, ${input.firstName}. We got your message and someone from our team will follow up shortly.`;

  const rows: Row[] = [
    ...(record.kind === 'case' ? [['Subject', record.input.subject] as Row] : []),
    ['Organization', input.organizationName],
    ...(record.kind === 'lead' ? [['Interest', record.input.interest] as Row] : []),
    ['Message', input.message],
  ];
  const hasSummary = rows.some(([, value]) => value);

  return {
    subject: 'We got your message',
    html: htmlDocument(
      `<p>${escapeHtml(thanks)}</p>` +
        (hasSummary ? `<p>What you sent us:</p>${rowsHtml(rows)}` : '') +
        '<p>The injily team</p>',
    ),
    text: `${thanks}\n\n${hasSummary ? `What you sent us:\n${rowsText(rows)}\n\n` : ''}The injily team\n`,
  };
}

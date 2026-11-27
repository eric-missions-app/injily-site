import 'server-only';
import { escapeHtml, htmlDocument, rowsHtml, rowsText, type IntakeRecord, type RenderedEmail, type Row } from './shared';

/** The longest a visitor-supplied value gets in the confirmation. */
const MAX_VALUE_LENGTH = 80;

/** On one line, and cut to `MAX_VALUE_LENGTH` characters (the last one an ellipsis). */
function excerpt(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const characters = Array.from(value.replace(/\s+/g, ' '));
  if (characters.length <= MAX_VALUE_LENGTH) return characters.join('');
  return `${characters.slice(0, MAX_VALUE_LENGTH - 1).join('')}…`;
}

/**
 * The confirmation to the visitor: thanks, someone will follow up, and a short summary of what they sent. It goes to
 * whatever address the form gave, so it leaves out the free-text message and cuts every value it repeats.
 */
export function visitorConfirmation(record: IntakeRecord): RenderedEmail {
  const { input } = record;
  const thanks = `Thanks, ${excerpt(input.firstName)}. We got your message and someone from our team will follow up shortly.`;

  const rows: Row[] = [
    ...(record.kind === 'case' ? [['Subject', excerpt(record.input.subject)] as Row] : []),
    ['Organization', excerpt(input.organizationName)],
    ...(record.kind === 'lead' ? [['Interest', excerpt(record.input.interest)] as Row] : []),
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

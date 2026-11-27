import 'server-only';
import { getDb } from '@/server/db/client';
import { activities } from '@/server/db/schema';
import { sendEmail } from '@/server/email/client';
import type { IntakeRecord } from '@/server/email/templates/shared';
import { teamNotification } from '@/server/email/templates/teamNotification';
import { visitorConfirmation } from '@/server/email/templates/visitorConfirmation';

/**
 * Runs after an intake transaction commits: emails `TEAM_INBOX` and the visitor, and writes an `email` activity on the
 * record for each one sent. Never throws: a failure is logged with the record id only, so it can't fail the
 * submission.
 */
export async function sendIntakeEmails(record: IntakeRecord): Promise<void> {
  try {
    const teamInbox = process.env.TEAM_INBOX;
    if (!teamInbox) console.info('email skipped', { recordId: record.id, reason: 'no TEAM_INBOX' });

    const [teamSent, visitorSent] = await Promise.all([
      teamInbox ? sendEmail({ to: teamInbox, ...teamNotification(record) }, record.id) : false,
      sendEmail({ to: record.input.email, ...visitorConfirmation(record) }, record.id),
    ]);

    const bodies = [
      teamSent && 'Team notification emailed.',
      visitorSent && 'Confirmation emailed to the visitor.',
    ].filter((body): body is string => Boolean(body));
    if (bodies.length === 0) return;

    await getDb()
      .insert(activities)
      .values(
        bodies.map((body) => ({
          recordType: record.kind === 'lead' ? ('lead' as const) : ('service_case' as const),
          recordId: record.id,
          kind: 'email' as const,
          body,
        })),
      );
  } catch (error) {
    const code = (error as { code?: unknown } | null)?.code;
    console.error('intake emails failed', {
      recordId: record.id,
      error: error instanceof Error ? error.name : 'unknown',
      code: code ?? '',
    });
  }
}

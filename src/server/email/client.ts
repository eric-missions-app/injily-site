import 'server-only';
import { Resend } from 'resend';

export type Email = { to: string; subject: string; html: string; text: string };

/** Intake waits for its emails before replying, and the Resend SDK sets no timeout of its own. */
const SEND_TIMEOUT_MS = 5000;

let resend: Resend | undefined;

/**
 * Sends one email through Resend (`RESEND_API_KEY`, from `EMAIL_FROM`) and returns whether it was sent. `recordId` is
 * the Lead or Service Case the email is about. Without a key (local dev) nothing is sent and "email skipped" is
 * logged. A request still unanswered after `SEND_TIMEOUT_MS` is aborted and logged as `timeout`. A failure is logged
 * with the record id and the error name only (never the message, which can quote an address) and returns false; this
 * never throws.
 */
export async function sendEmail(email: Email, recordId: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.info('email skipped', { recordId, reason: apiKey ? 'no EMAIL_FROM' : 'no RESEND_API_KEY' });
    return false;
  }

  const signal = AbortSignal.timeout(SEND_TIMEOUT_MS);
  try {
    resend ??= new Resend(apiKey);
    const { error } = await resend.emails.send({ from, ...email }, { signal });
    if (error) {
      // The SDK reports an aborted request as a generic `application_error`.
      console.error('email failed', {
        recordId,
        error: signal.aborted ? 'timeout' : error.name,
        status: error.statusCode,
      });
      return false;
    }
    return true;
  } catch (error) {
    const name = error instanceof Error ? error.name : 'unknown';
    console.error('email failed', { recordId, error: signal.aborted ? 'timeout' : name });
    return false;
  }
}

import 'server-only';
import { Resend } from 'resend';

export type Email = { to: string; subject: string; html: string; text: string };

let resend: Resend | undefined;

/**
 * Sends one email through Resend (`RESEND_API_KEY`, from `EMAIL_FROM`) and returns whether it was sent. `recordId` is
 * the Lead or Service Case the email is about; it's the only thing logged. Without a key (local dev) nothing is sent
 * and "email skipped" is logged. A failure is logged with the error name only (never the message, which can quote an
 * address) and returns false; this never throws.
 */
export async function sendEmail(email: Email, recordId: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.info('email skipped', { recordId, reason: apiKey ? 'no EMAIL_FROM' : 'no RESEND_API_KEY' });
    return false;
  }

  try {
    resend ??= new Resend(apiKey);
    const { error } = await resend.emails.send({ from, ...email });
    if (error) {
      console.error('email failed', { recordId, error: error.name, status: error.statusCode });
      return false;
    }
    return true;
  } catch (error) {
    console.error('email failed', { recordId, error: error instanceof Error ? error.name : 'unknown' });
    return false;
  }
}

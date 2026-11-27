import { z } from 'zod';
import { contactFields, optionalText, requiredText } from './shared';

/** `CaseForm` and `POST /api/intake/case`. The message is required; the subject is optional. */
export const caseInput = z.object({
  ...contactFields,
  subject: optionalText('the subject', 200),
  message: requiredText('your message', 2000),
});
export type CaseInput = z.infer<typeof caseInput>;

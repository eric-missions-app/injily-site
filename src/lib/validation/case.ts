import { z } from 'zod';
import { contactFields, requiredText } from './shared';

/** `CaseForm` and `POST /api/intake/case`. */
export const caseInput = z.object({
  ...contactFields,
  subject: requiredText('a subject', 200),
});
export type CaseInput = z.infer<typeof caseInput>;

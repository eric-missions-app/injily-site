import { z } from 'zod';
import { contactFields, optionalText } from './shared';

/** `LeadForm` and `POST /api/intake/lead`. */
export const leadInput = z.object({
  ...contactFields,
  interest: optionalText('the interest', 200),
});
export type LeadInput = z.infer<typeof leadInput>;

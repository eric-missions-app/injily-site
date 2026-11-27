import { z } from 'zod';
import { contactFields } from './shared';

/** `LeadForm` and `POST /api/intake/lead`. */
export const leadInput = z.object(contactFields);
export type LeadInput = z.infer<typeof leadInput>;

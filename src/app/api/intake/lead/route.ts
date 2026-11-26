import type { NextRequest } from 'next/server';
import { leadInput } from '@/lib/validation/lead';
import { createLead } from '@/server/services/leads';
import { handleIntake } from '@/app/api/intake/handleIntake';

/** Public: the "Get early access" form. POST only; any other method gets 405 from Next.js. */
export function POST(request: NextRequest) {
  return handleIntake(request, 'lead', leadInput, createLead);
}

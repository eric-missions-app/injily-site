import type { NextRequest } from 'next/server';
import { caseInput } from '@/lib/validation/case';
import { createCase } from '@/server/services/cases';
import { handleIntake } from '@/app/api/intake/handleIntake';

/** Public: the contact form. POST only; any other method gets 405 from Next.js. */
export function POST(request: NextRequest) {
  return handleIntake(request, 'case', caseInput, createCase);
}

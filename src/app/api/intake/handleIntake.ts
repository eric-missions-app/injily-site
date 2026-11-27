import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { allowSubmission } from '@/server/services/rateLimit';

type IntakeSchema = z.ZodType<{ firstName: string; website?: string }, unknown>;

/**
 * The shared request flow of both public intake endpoints, in order: parse JSON with the form's Zod schema (400 with
 * field errors), drop a filled honeypot quietly (200, nothing stored), rate-limit (429), call the service
 * (200 `{ ok: true, firstName }`). Errors are generic; only record ids and error names are logged, never form contents.
 */
export async function handleIntake<S extends IntakeSchema>(
  request: NextRequest,
  kind: 'lead' | 'case',
  schema: S,
  create: (input: z.output<S>) => Promise<Record<string, string | undefined>>,
): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_input', fieldErrors: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }
  const input = parsed.data;
  const success = NextResponse.json({ ok: true, firstName: input.firstName });

  if (input.website) return success;

  try {
    if (!(await allowSubmission(clientIp(request), kind))) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }
    const ids = await create(input);
    console.info(`intake ${kind} created`, ids);
    return success;
  } catch (error) {
    // Name and Postgres code only: a database message can quote the submitted values.
    const code = (error as { code?: unknown } | null)?.code;
    console.error(`intake ${kind} failed`, error instanceof Error ? error.name : 'unknown', code ?? '');
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}

/** The visitor's IP: the first `x-forwarded-for` entry (set by Vercel), else `x-real-ip`, else a shared fallback. */
function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || request.ip || 'unknown';
}

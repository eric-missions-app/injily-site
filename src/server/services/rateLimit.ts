import 'server-only';
import { createHmac } from 'node:crypto';
import { and, count, eq, gt, sql } from 'drizzle-orm';
import { getDb } from '@/server/db/client';
import { submissions } from '@/server/db/schema';

const MAX_SUBMISSIONS = 5;
const WINDOW_MINUTES = 10;

type SubmissionKind = (typeof submissions.$inferInsert)['kind'];

/** HMAC-SHA256 of the IP with `IP_HASH_SALT`. The raw IP is never stored. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) throw new Error('IP_HASH_SALT is not set. Copy .env.example to .env.local and fill it in.');
  return createHmac('sha256', salt).update(ip).digest('hex');
}

/**
 * Allows at most 5 intake submissions per IP hash per 10 minutes, across both forms. An allowed submission is
 * recorded in `submissions`; a refused one isn't. A per-hash advisory lock makes check-and-record atomic, so
 * parallel requests from one IP can't slip past the limit.
 */
export async function allowSubmission(ip: string, kind: SubmissionKind): Promise<boolean> {
  const ipHash = hashIp(ip);
  return getDb().transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${ipHash}))`);

    const [recent] = await tx
      .select({ total: count() })
      .from(submissions)
      .where(
        and(
          eq(submissions.ipHash, ipHash),
          gt(submissions.createdAt, sql`now() - make_interval(mins => ${WINDOW_MINUTES})`),
        ),
      );
    if (recent.total >= MAX_SUBMISSIONS) return false;

    await tx.insert(submissions).values({ kind, ipHash });
    return true;
  });
}

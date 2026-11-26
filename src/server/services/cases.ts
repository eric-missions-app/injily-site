import 'server-only';
import { getDb } from '@/server/db/client';
import { activities, serviceCases } from '@/server/db/schema';
import type { CaseInput } from '@/lib/validation/case';
import { upsertContact } from './people';

export type CreatedCase = { caseId: string; personId: string; organizationId: string | undefined };

/**
 * Intake for the contact form. In one transaction: upserts the person and organization, creates the service case
 * (status `open`) and writes its first activity. `input` must already be parsed with `caseInput`.
 */
export async function createCase(input: CaseInput): Promise<CreatedCase> {
  return getDb().transaction(async (tx) => {
    const { personId, organizationId } = await upsertContact(tx, input, new Date());

    const [serviceCase] = await tx
      .insert(serviceCases)
      .values({
        personId,
        subject: input.subject,
        message: input.message,
        status: 'open',
      })
      .returning({ id: serviceCases.id });

    await tx.insert(activities).values({
      recordType: 'service_case',
      recordId: serviceCase.id,
      kind: 'note',
      body: 'Service case created from the website form.',
    });

    return { caseId: serviceCase.id, personId, organizationId };
  });
}

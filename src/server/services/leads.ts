import 'server-only';
import { getDb } from '@/server/db/client';
import { activities, leads } from '@/server/db/schema';
import type { LeadInput } from '@/lib/validation/lead';
import { upsertContact } from './people';

export type CreatedLead = { leadId: string; personId: string; organizationId: string | undefined };

/**
 * Intake for the "Get early access" form. In one transaction: upserts the person and organization, creates the
 * lead (status `new`) and writes its first activity. `input` must already be parsed with `leadInput`.
 */
export async function createLead(input: LeadInput): Promise<CreatedLead> {
  return getDb().transaction(async (tx) => {
    const { personId, organizationId } = await upsertContact(tx, input, new Date());

    const [lead] = await tx
      .insert(leads)
      .values({
        personId,
        organizationId,
        sourcePage: input.sourcePage,
        interest: input.interest,
        message: input.message,
        status: 'new',
      })
      .returning({ id: leads.id });

    await tx.insert(activities).values({
      recordType: 'lead',
      recordId: lead.id,
      kind: 'note',
      body: 'Lead created from the website form.',
    });

    return { leadId: lead.id, personId, organizationId };
  });
}

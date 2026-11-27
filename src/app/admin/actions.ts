'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ZodError } from 'zod';
import {
  convertLeadInput,
  noteInput,
  opportunityEditInput,
  organizationEditInput,
  ownerChangeInput,
  personEditInput,
  statusChangeInput,
  type AdminRecordType,
} from '@/lib/validation/admin';
import { requireAdmin, signOut } from '@/server/auth';
import { addNote } from '@/server/services/activities';
import { setCaseOwner, setCaseStatus } from '@/server/services/cases';
import { setLeadOwner, setLeadStatus } from '@/server/services/leads';
import {
  convertLeadToOpportunity,
  updateOpportunity,
  type ConvertResult,
} from '@/server/services/opportunities';
import { updateOrganization } from '@/server/services/organizations';
import { updatePerson } from '@/server/services/people';

/**
 * What an admin form shows after submitting: nothing yet, "Saved", or one error line. Edit forms also get
 * `fieldErrors` (field name → message), shown next to each field by `FieldError`.
 */
export type ActionState =
  | { status: 'idle' }
  | { status: 'saved'; at: number }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> };

const NOT_FOUND: ActionState = { status: 'error', message: 'This record no longer exists.' };
const FAILED: ActionState = { status: 'error', message: 'Something went wrong saving this. Please try again.' };

/**
 * Runs a service call so a database failure (timeout, dropped connection, lock wait) becomes one error line in the
 * form instead of crashing the page. Logs only the error name and message, never form contents.
 */
async function attempt(label: string, run: () => Promise<ActionState>): Promise<ActionState> {
  try {
    return await run();
  } catch (error) {
    console.error(`admin action ${label} failed:`, error instanceof Error ? error.name : 'unknown');
    return FAILED;
  }
}

function invalid(error: ZodError): ActionState {
  return { status: 'error', message: error.issues[0]?.message ?? 'Check the value and try again.' };
}

/** A validation failure on an edit form: each field's first message, shown next to the field. */
function invalidFields(error: ZodError): ActionState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !(field in fieldErrors)) fieldErrors[field] = issue.message;
  }
  return { status: 'error', message: 'Check the fields marked above.', fieldErrors };
}

function fieldError(field: string, message: string): ActionState {
  return { status: 'error', message: 'Check the fields marked above.', fieldErrors: { [field]: message } };
}

/** People, organizations and opportunities show up on each other's pages and on leads and cases. */
function savedEverywhere(): ActionState {
  revalidatePath('/admin', 'layout');
  return { status: 'saved', at: Date.now() };
}

function saved(recordType: AdminRecordType, id: string): ActionState {
  const base = recordType === 'lead' ? '/admin/leads' : '/admin/cases';
  revalidatePath(base);
  revalidatePath(`${base}/${id}`);
  return { status: 'saved', at: Date.now() };
}

export async function changeStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await requireAdmin();
  const parsed = statusChangeInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  const input = parsed.data;
  return attempt('changeStatus', async () => {
    const result =
      input.recordType === 'lead'
        ? await setLeadStatus(input.id, input.status, actor)
        : await setCaseStatus(input.id, input.status, actor);
    if (result === 'use_convert') {
      return { status: 'error', message: 'Only “Convert to opportunity” can mark a lead converted.' };
    }
    return result === 'ok' ? saved(input.recordType, input.id) : NOT_FOUND;
  });
}

export async function changeOwner(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await requireAdmin();
  const parsed = ownerChangeInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  const input = parsed.data;
  return attempt('changeOwner', async () => {
    const result =
      input.recordType === 'lead'
        ? await setLeadOwner(input.id, input.ownerEmail, actor)
        : await setCaseOwner(input.id, input.ownerEmail, actor);
    return result === 'ok' ? saved(input.recordType, input.id) : NOT_FOUND;
  });
}

export async function addNoteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await requireAdmin();
  const parsed = noteInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  const input = parsed.data;
  return attempt('addNote', async () => {
    const result = await addNote(input, actor);
    return result === 'ok' ? saved(input.recordType, input.id) : NOT_FOUND;
  });
}

export async function savePerson(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = personEditInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalidFields(parsed.error);

  return attempt('savePerson', async () => {
    const result = await updatePerson(parsed.data);
    if (result === 'not_found') return NOT_FOUND;
    if (result === 'email_taken') return fieldError('email', 'Another person already has this email address.');
    if (result === 'organization_not_found') return fieldError('organizationId', 'That organization no longer exists.');
    return savedEverywhere();
  });
}

export async function saveOrganization(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = organizationEditInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalidFields(parsed.error);

  return attempt('saveOrganization', async () => {
    const result = await updateOrganization(parsed.data);
    if (result === 'not_found') return NOT_FOUND;
    if (result === 'duplicate') {
      return fieldError(
        'name',
        parsed.data.country
          ? 'Another organization in this country already has this name.'
          : 'Another organization with no country already has this name.',
      );
    }
    return savedEverywhere();
  });
}

export async function saveOpportunity(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await requireAdmin();
  const parsed = opportunityEditInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalidFields(parsed.error);

  return attempt('saveOpportunity', async () => {
    const result = await updateOpportunity(parsed.data, actor);
    return result === 'ok' ? savedEverywhere() : NOT_FOUND;
  });
}

const CONVERT_ERRORS: Record<Exclude<ConvertResult['status'], 'ok'>, ActionState> = {
  not_found: NOT_FOUND,
  not_qualified: { status: 'error', message: 'Only a qualified lead can be converted.' },
  already_converted: { status: 'error', message: 'This lead already has an opportunity.' },
};

/** Converts a qualified Lead into an Opportunity, then opens the new Opportunity. */
export async function convertLeadAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await requireAdmin();
  const parsed = convertLeadInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  let result: ConvertResult;
  try {
    result = await convertLeadToOpportunity(parsed.data.leadId, actor);
  } catch (error) {
    console.error('admin action convertLead failed:', error instanceof Error ? error.name : 'unknown');
    return FAILED;
  }
  if (result.status !== 'ok') return CONVERT_ERRORS[result.status];

  revalidatePath('/admin', 'layout');
  // Outside the try: redirect() works by throwing.
  redirect(`/admin/opportunities/${result.opportunityId}`);
}

export async function signOutAction(): Promise<void> {
  await requireAdmin();
  await signOut({ redirectTo: '/' });
}

'use server';

import { revalidatePath } from 'next/cache';
import type { ZodError } from 'zod';
import {
  noteInput,
  ownerChangeInput,
  statusChangeInput,
  type AdminRecordType,
} from '@/lib/validation/admin';
import { requireAdmin, signOut } from '@/server/auth';
import { addNote } from '@/server/services/activities';
import { setCaseOwner, setCaseStatus } from '@/server/services/cases';
import { setLeadOwner, setLeadStatus } from '@/server/services/leads';

/** What an admin form shows after submitting: nothing yet, "Saved", or one error line. */
export type ActionState = { status: 'idle' } | { status: 'saved'; at: number } | { status: 'error'; message: string };

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

export async function signOutAction(): Promise<void> {
  await requireAdmin();
  await signOut({ redirectTo: '/' });
}

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
  const result =
    input.recordType === 'lead'
      ? await setLeadStatus(input.id, input.status, actor)
      : await setCaseStatus(input.id, input.status, actor);
  return result === 'ok' ? saved(input.recordType, input.id) : NOT_FOUND;
}

export async function changeOwner(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await requireAdmin();
  const parsed = ownerChangeInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  const input = parsed.data;
  const result =
    input.recordType === 'lead'
      ? await setLeadOwner(input.id, input.ownerEmail, actor)
      : await setCaseOwner(input.id, input.ownerEmail, actor);
  return result === 'ok' ? saved(input.recordType, input.id) : NOT_FOUND;
}

export async function addNoteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await requireAdmin();
  const parsed = noteInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error);

  const result = await addNote(parsed.data, actor);
  return result === 'ok' ? saved(parsed.data.recordType, parsed.data.id) : NOT_FOUND;
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: '/' });
}

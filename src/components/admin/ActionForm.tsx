'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import type { ActionState } from '@/app/admin/actions';

type Props = {
  /** A Server Action from `src/app/admin/actions.ts`. */
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  /** Clear the fields after a successful save (the note box). */
  resetOnSave?: boolean;
  children: React.ReactNode;
};

const INITIAL: ActionState = { status: 'idle' };

/** An admin edit form: runs a Server Action, disables its button while saving, then shows "Saved" or the error. */
export default function ActionForm({ action, submitLabel, resetOnSave = false, children }: Props) {
  const [state, formAction] = useFormState(action, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSave && state.status === 'saved') formRef.current?.reset();
  }, [state, resetOnSave]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {children}
      <div className="flex items-center gap-3">
        <SubmitButton label={submitLabel} />
        <p aria-live="polite" className="text-sm">
          {state.status === 'saved' && <span className="text-success">Saved</span>}
          {state.status === 'error' && <span className="text-danger">{state.message}</span>}
        </p>
      </div>
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

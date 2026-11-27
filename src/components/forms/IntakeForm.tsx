'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { z } from 'zod';
import { firstWord } from '@/lib/format';

type FieldErrors = Partial<Record<string, string[]>>;

const GENERIC_ERROR = 'Something went wrong. Please try again in a few minutes.';

const inputClass =
  'mt-2 block w-full min-w-0 rounded-lg border bg-surface px-3 py-2 text-base text-text placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

type IntakeFormProps = {
  /** `leadInput` or `caseInput`: the same schema the route handler parses with. */
  schema: z.ZodType<{ name: string }, unknown>;
  endpoint: '/api/intake/lead' | '/api/intake/case';
  submitLabel: string;
  /** The optional organization field's label; leave it out for no organization field. */
  organizationLabel?: string;
  /** The message field's label, and whether the schema requires it. */
  message: { label: string; required?: boolean };
  /** Extra values sent with the form, read at submit time (the lead's `sourcePage`). */
  extraValues?: () => Record<string, string | undefined>;
};

/**
 * The fields, validation and submit flow `LeadForm` and `CaseForm` share. Validates with the same Zod schema as the
 * route handler, POSTs JSON, and replaces itself with the follow-up confirmation on success. Inputs are uncontrolled,
 * so a failed submit keeps everything the visitor typed.
 */
export default function IntakeForm({
  schema,
  endpoint,
  submitLabel,
  organizationLabel,
  message,
  extraValues,
}: IntakeFormProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const data = new FormData(event.currentTarget);
    const values: Record<string, unknown> = { ...extraValues?.() };
    data.forEach((value, key) => {
      if (typeof value === 'string') values[key] = value;
    });

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      showFieldErrors(z.flattenError(parsed.error).fieldErrors);
      setFormError(false);
      return;
    }

    setFieldErrors({});
    setFormError(false);
    setSending(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setSentTo(firstWord(parsed.data.name));
        return;
      }
      const body: unknown = await response.json().catch(() => null);
      const serverErrors = (body as { fieldErrors?: FieldErrors } | null)?.fieldErrors;
      if (response.status === 400 && serverErrors && Object.keys(serverErrors).length > 0) {
        showFieldErrors(serverErrors);
      } else {
        setFormError(true);
      }
    } catch {
      setFormError(true);
    } finally {
      setSending(false);
    }
  }

  /** Shows the errors and moves focus to the first invalid field, in form order. */
  function showFieldErrors(errors: FieldErrors) {
    // Render before focusing, so a screen reader announces the field together with its error.
    flushSync(() => setFieldErrors(errors));
    for (const element of Array.from(formRef.current?.elements ?? [])) {
      const name = (element as HTMLInputElement).name;
      if (name && errors[name]) {
        (element as HTMLElement).focus();
        break;
      }
    }
  }

  if (sentTo !== null) return <Confirmation firstName={sentTo} />;

  const error = (name: string) => fieldErrors[name]?.[0];

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-6">
      <TextField name="name" label="Name" required autoComplete="name" error={error('name')} />
      <TextField name="email" label="Email" type="email" required autoComplete="email" error={error('email')} />
      <TextField name="phone" label="Phone" type="tel" required autoComplete="tel" error={error('phone')} />
      {organizationLabel && (
        <TextField
          name="organizationName"
          label={organizationLabel}
          autoComplete="organization"
          error={error('organizationName')}
        />
      )}
      <Field label={message.label} required={message.required} error={error('message')}>
        {(props) => <textarea name="message" rows={5} {...props} />}
      </Field>

      {/* Honeypot: hidden from people and assistive tech and never focused, so only bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div>
        {formError && (
          <p role="alert" className="mb-4 text-sm font-semibold text-danger">
            {GENERIC_ERROR}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {sending ? 'Sending…' : submitLabel}
        </button>
        <p className="mt-3 text-sm text-muted">
          By sending this you agree to our{' '}
          {/* A new tab, so reading the policy never loses what was typed or changes the lead's `sourcePage`. */}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm underline underline-offset-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            privacy policy<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </form>
  );
}

type ControlProps = {
  id: string;
  'aria-invalid': boolean | undefined;
  'aria-describedby': string | undefined;
  'aria-required': boolean | undefined;
  className: string;
};

/** A label, one control and its error. The control gets its id and ARIA wiring through the render prop. */
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-text">
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger">
            {' '}
            *
          </span>
        )}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
        'aria-required': required || undefined,
        className: `${inputClass} ${error ? 'border-danger' : 'border-border'}`,
      })}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function TextField({
  name,
  label,
  type = 'text',
  required,
  autoComplete,
  error,
}: {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <Field label={label} required={required} error={error}>
      {(props) => <input type={type} name={name} autoComplete={autoComplete} {...props} />}
    </Field>
  );
}

/** Replaces the form after a successful submit; takes focus so keyboard and screen reader users land on it. */
function Confirmation({ firstName }: { firstName: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <p
      ref={ref}
      tabIndex={-1}
      role="status"
      className="rounded-lg text-lg font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      Thanks, {firstName}. Someone from our team will follow up shortly.
    </p>
  );
}

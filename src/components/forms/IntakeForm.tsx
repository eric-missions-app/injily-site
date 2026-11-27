'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { z } from 'zod';
import { COUNTRIES } from '@/content/countries';
import { ORGANIZATION_TYPES } from '@/lib/validation/shared';

type FieldErrors = Partial<Record<string, string[]>>;

const ORGANIZATION_TYPE_LABELS: Record<(typeof ORGANIZATION_TYPES)[number], string> = {
  church: 'Church',
  ministry: 'Ministry',
  mission_team: 'Mission team',
  other: 'Other',
};

const GENERIC_ERROR = 'Something went wrong. Please try again in a few minutes.';

const inputClass =
  'mt-2 block w-full min-w-0 rounded-lg border bg-surface px-3 py-2 text-base text-text placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

type IntakeFormProps = {
  /** `leadInput` or `caseInput`: the same schema the route handler parses with. */
  schema: z.ZodType<{ firstName: string }, unknown>;
  endpoint: '/api/intake/lead' | '/api/intake/case';
  submitLabel: string;
  /** The case form's required subject field. */
  withSubject?: boolean;
  /** Extra values sent with the form, read at submit time (the lead's `sourcePage`). */
  extraValues?: () => Record<string, string | undefined>;
};

/**
 * The fields, validation and submit flow `LeadForm` and `CaseForm` share. Validates with the same Zod schema as the
 * route handler, POSTs JSON, and replaces itself with the follow-up confirmation on success. Inputs are uncontrolled,
 * so a failed submit keeps everything the visitor typed.
 */
export default function IntakeForm({ schema, endpoint, submitLabel, withSubject, extraValues }: IntakeFormProps) {
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
    values.consent = data.get('consent') === 'on';

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
        setSentTo(parsed.data.firstName);
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
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      <TextField name="firstName" label="First name" required autoComplete="given-name" error={error('firstName')} />
      <TextField name="lastName" label="Last name" required autoComplete="family-name" error={error('lastName')} />
      <TextField
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        error={error('email')}
      />
      <TextField name="phone" label="Phone" type="tel" autoComplete="tel" error={error('phone')} />
      <TextField
        name="organizationName"
        label="Organization"
        autoComplete="organization"
        error={error('organizationName')}
      />
      <Field label="Organization type" error={error('organizationType')}>
        {(props) => (
          <select name="organizationType" defaultValue="" {...props}>
            <option value="">Choose a type</option>
            {ORGANIZATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {ORGANIZATION_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        )}
      </Field>
      <TextField name="role" label="Role" autoComplete="organization-title" error={error('role')} />
      <TextField name="city" label="City" autoComplete="address-level2" error={error('city')} />
      <Field label="Country" required error={error('country')}>
        {(props) => (
          <select name="country" defaultValue="" autoComplete="country" {...props}>
            <option value="">Choose your country</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        )}
      </Field>
      {withSubject && (
        <TextField name="subject" label="Subject" required error={error('subject')} className="sm:col-span-2" />
      )}
      <Field label="Message" error={error('message')} className="sm:col-span-2">
        {(props) => <textarea name="message" rows={5} {...props} />}
      </Field>

      <ConsentField error={error('consent')} />

      {/* Honeypot: hidden from people and assistive tech and never focused, so only bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="sm:col-span-2">
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
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={className}>
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
  className,
}: {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  autoComplete?: string;
  error?: string;
  className?: string;
}) {
  return (
    <Field label={label} required={required} error={error} className={className}>
      {(props) => <input type={type} name={name} autoComplete={autoComplete} {...props} />}
    </Field>
  );
}

function ConsentField({ error }: { error?: string }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="sm:col-span-2">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          name="consent"
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        <label htmlFor={id} className="text-sm text-text">
          I agree to the{' '}
          {/* A new tab, so reading the policy never loses what was typed or changes the lead's `sourcePage`. */}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm font-semibold text-primary underline underline-offset-2 hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            privacy policy<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <span aria-hidden="true" className="text-danger">
            {' '}
            *
          </span>
        </label>
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
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

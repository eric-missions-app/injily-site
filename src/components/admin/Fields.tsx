import FieldError from './FieldError';

/** The input style every admin form field uses. */
export const fieldClass =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

type Base = {
  /** The form field name; also the input's id, so use each name once per page. */
  name: string;
  label: string;
  hint?: string;
};

function Label({ name, label }: Pick<Base, 'name' | 'label'>) {
  return (
    <label htmlFor={name} className="block text-sm font-semibold">
      {label}
    </label>
  );
}

function describedBy(name: string, hint?: string) {
  return hint ? `${name}-hint ${name}-error` : `${name}-error`;
}

function Hint({ name, hint }: Pick<Base, 'name' | 'hint'>) {
  return hint ? (
    <p id={`${name}-hint`} className="text-xs text-muted">
      {hint}
    </p>
  ) : null;
}

/** A labelled one-line input inside an `ActionForm`, with its hint and field error. */
export function TextField({
  name,
  label,
  hint,
  defaultValue,
  type = 'text',
  ...rest
}: Base & {
  defaultValue: string | null;
  type?: 'text' | 'email' | 'tel' | 'url' | 'date';
} & Pick<React.InputHTMLAttributes<HTMLInputElement>, 'autoComplete' | 'inputMode' | 'maxLength' | 'placeholder'>) {
  return (
    <div className="space-y-1">
      <Label name={name} label={label} />
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        aria-describedby={describedBy(name, hint)}
        className={fieldClass}
        {...rest}
      />
      <Hint name={name} hint={hint} />
      <FieldError name={name} />
    </div>
  );
}

/** A labelled select inside an `ActionForm`, with its hint and field error. */
export function SelectField({
  name,
  label,
  hint,
  defaultValue,
  options,
}: Base & { defaultValue: string; options: { value: string; label: string }[] }) {
  return (
    <div className="space-y-1">
      <Label name={name} label={label} />
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        aria-describedby={describedBy(name, hint)}
        className={fieldClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Hint name={name} hint={hint} />
      <FieldError name={name} />
    </div>
  );
}

/** A labelled multi-line field inside an `ActionForm`, with its hint and field error. */
export function TextAreaField({
  name,
  label,
  hint,
  defaultValue,
  rows = 5,
}: Base & { defaultValue: string | null; rows?: number }) {
  return (
    <div className="space-y-1">
      <Label name={name} label={label} />
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        aria-describedby={describedBy(name, hint)}
        className={fieldClass}
      />
      <Hint name={name} hint={hint} />
      <FieldError name={name} />
    </div>
  );
}

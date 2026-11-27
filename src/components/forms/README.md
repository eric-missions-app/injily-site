# src/components/forms/

The two intake forms and what they share. They are the only interactive part of a marketing page: client components
that validate with the Zod schema from `@/lib/validation` (the same one the route handler uses) and POST JSON to
`/api/intake/*`. The pages around them stay static.

## What's here now

| File | Client? | What it does |
|---|---|---|
| `LeadForm.tsx` | yes | The "Get early access" form on `/get-started`. Validates with `leadInput`, POSTs to `/api/intake/lead`, and sends `sourcePage` (the page the visitor came from). |
| `CaseForm.tsx` | yes | The contact form on `/contact`. Validates with `caseInput`, POSTs to `/api/intake/case`, and adds the required Subject field. |
| `IntakeForm.tsx` | yes | What both forms share: the fields, the honeypot, validation, the submit flow and the confirmation. |
| `SourcePageTracker.tsx` | yes | Renders nothing. Rendered once in the root layout, it records each path the visitor visits. |
| `sourcePage.ts` | n/a | `rememberPath()` (called by the tracker) and `referringPath()`: the previous path on this site, else a same-origin `document.referrer`, else `undefined`. `next/link` navigation never updates `document.referrer`, which is why the tracker exists. |

## How a submit works

1. **Fields:** first name\*, last name\*, email\*, phone, organization, organization type, role, city, country\*
   (a select of `COUNTRIES` from `@/content/countries`, sending the ISO code), Subject\* (case only), message, and the
   consent checkbox\* linking to `/privacy`. Every field has a visible label; required ones show `*`. The privacy link
   is a plain `<a>` that opens in a new tab, so the form keeps its values and `sourcePage` is unaffected.
2. **Honeypot:** a `website` input, off-screen, `aria-hidden`, `tabIndex={-1}` and `autoComplete="off"`, so people
   and keyboards never reach it. The server accepts a filled one and stores nothing.
3. **Validation:** the form has `noValidate`; the Zod schema runs first, and its messages show under each field
   (`aria-invalid` and `aria-describedby` set, then focus moves to the first invalid field, once the errors have
   rendered). No request is sent until it passes. A 400 from the server with `fieldErrors` is shown the same way.
4. **Sending:** the button is disabled and reads "Sending…". A 429 or any other failure shows one line above the
   button: "Something went wrong. Please try again in a few minutes." Inputs are uncontrolled, so the values stay.
5. **Success:** the form is replaced by "Thanks, {first name}. Someone from our team will follow up shortly.", which
   takes focus.

## Rules

- Never import from `@/server`: these run in the browser.
- Never log what the visitor typed.
- Colors only through tokens (`border-border`, `text-danger`, `bg-surface`, …); every control has
  `focus-visible:ring-2 focus-visible:ring-primary`.
- A new field starts in the Zod schema (`src/lib/validation/`), then goes here, then into the privacy policy's
  "What we collect".

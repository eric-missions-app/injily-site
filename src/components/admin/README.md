# src/components/admin/

Components used only by the admin screens in `src/app/admin/`. They follow the same rules as the marketing
components: colors only through tokens, `'use client'` only for interactive state, visible focus rings.

| Component | Client? | What it does |
|---|---|---|
| `ActionForm.tsx` | yes | Wraps an admin edit form around a Server Action from `src/app/admin/actions.ts` (`useFormState`). Disables the button while saving ("Saving…"), then shows "Saved" or the action's one-line error. `resetOnSave` clears the fields after a save (the note box). `noValidate` skips the browser's own checks so the edit forms show the Zod messages instead. The fields go in as children, including the hidden `id` (and `recordType`). It shares the latest result with `FieldError` through `ActionStateContext`. |
| `FieldError.tsx` | yes | One field's message from the action's `fieldErrors`, shown under the field (`id="<name>-error"`). Must sit inside an `ActionForm`. |
| `Fields.tsx` | no | `TextField`, `SelectField` and `TextAreaField`: a label, the control (id = name), an optional hint and its `FieldError`, wired up with `aria-describedby`. Also `fieldClass`, the shared input style. |
| `Detail.tsx` | no | One label/value row of a detail page's `<dl>`; an empty value shows a muted dash. |
| `Timeline.tsx` | no | A record's activity timeline card (kind, author, time, body), used on Lead, Case and Opportunity pages. |
| `FilterPills.tsx` | no | The "All / one per value" filter links above the Leads, Cases (`?status=`) and Opportunities (`?stage=`) lists. |
| `RelatedList.tsx` | no | A card of links to related records (a person's leads and cases; an organization's people, leads and opportunities), each with an optional detail line and status badge. |
| `StatusBadge.tsx` | no | A Lead or Service Case status, or an Opportunity stage, as a tinted pill (`in_progress` shows as "in progress"). Text stays `text-text` so it passes contrast in light and dark. |

Client components here never import from `@/server`; they get Server Actions as props.

# src/components/admin/

Components used only by the admin screens in `src/app/admin/`. They follow the same rules as the marketing
components: colors only through tokens, `'use client'` only for interactive state, visible focus rings.

| Component | Client? | What it does |
|---|---|---|
| `ActionForm.tsx` | yes | Wraps an admin edit form around a Server Action from `src/app/admin/actions.ts` (`useFormState`). Disables the button while saving ("Saving…"), then shows "Saved" or the action's one-line error. `resetOnSave` clears the fields after a save (the note box). The fields go in as children, including the hidden `recordType` and `id`. |
| `StatusBadge.tsx` | no | A Lead or Service Case status as a tinted pill (`in_progress` shows as "in progress"). Text stays `text-text` so it passes contrast in light and dark. |

Client components here never import from `@/server`; they get Server Actions as props.

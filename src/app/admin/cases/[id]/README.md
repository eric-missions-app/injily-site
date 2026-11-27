# src/app/admin/cases/[id]/

`/admin/cases/<uuid>`: one Service Case (`page.tsx`). It shows the subject, message, person and organization, and
has the status, owner and note forms (Server Actions in `../../actions.ts`) above the activity timeline. An id that
isn't a uuid, or a case that doesn't exist, is a 404.

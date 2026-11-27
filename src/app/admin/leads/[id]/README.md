# src/app/admin/leads/[id]/

`/admin/leads/<uuid>`: one Lead (`page.tsx`). It shows the request, person and organization, and has the status,
owner and note forms (Server Actions in `../../actions.ts`) above the activity timeline. An id that isn't a uuid,
or a Lead that doesn't exist, is a 404.

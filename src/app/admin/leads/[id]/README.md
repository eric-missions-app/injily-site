# src/app/admin/leads/[id]/

`/admin/leads/<uuid>`: one Lead (`page.tsx`). It shows the request, person and organization (linking to their own
pages), and has the status, owner and note forms (Server Actions in `../../actions.ts`) above the activity timeline.
A `qualified` lead with no opportunity yet shows "Convert to opportunity" (`convertLeadAction`), which opens the new
opportunity; once converted, the lead links to it. An id that isn't a uuid, or a Lead that doesn't exist, is a 404.

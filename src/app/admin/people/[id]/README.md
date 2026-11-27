# src/app/admin/people/[id]/

`/admin/people/<uuid>`: one Person (`page.tsx`). The edit form (first and last name, email, phone, city, country,
role, organization) saves through `savePerson` in `../../actions.ts` with `personEditInput`; errors show next to
each field and nothing is saved. Beside it are the person's leads and service cases, newest first. An id that isn't a
uuid, or a Person that doesn't exist, is a 404.

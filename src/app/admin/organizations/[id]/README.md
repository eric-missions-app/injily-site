# src/app/admin/organizations/[id]/

`/admin/organizations/<uuid>`: one Organization (`page.tsx`). The edit form (name, type, city, country, website)
saves through `saveOrganization` in `../../actions.ts` with `organizationEditInput`. Name + country must stay unique
(case-insensitive), as intake matches on them, so a clash is a field error on the name. Beside it are the
organization's people, leads and opportunities. An id that isn't a uuid, or an Organization that doesn't exist, is a
404.

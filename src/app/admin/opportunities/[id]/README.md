# src/app/admin/opportunities/[id]/

`/admin/opportunities/<uuid>`: one Opportunity (`page.tsx`). It links to its organization and the lead it came from,
has the edit form (name, stage, expected start, notes; `saveOpportunity` in `../../actions.ts` with
`opportunityEditInput`) and the activity timeline. A stage change is recorded as `status_change`, other changed
fields as one `note`. An id that isn't a uuid, or an Opportunity that doesn't exist, is a 404.

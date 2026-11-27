# src/app/admin/opportunities/

`/admin/opportunities`: the Opportunities list (`page.tsx`), newest first, filtered by `?stage=`. `[id]/` is one
Opportunity's detail page. Opportunities are created by converting a qualified Lead (the button on
`/admin/leads/<id>`). Data comes from `@/server/services/opportunities`. See [../README.md](../README.md) for the
admin rules.

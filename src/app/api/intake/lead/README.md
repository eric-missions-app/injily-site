# src/app/api/intake/lead/

`route.ts`: `POST /api/intake/lead`, the public endpoint behind the "Get early access" form. It validates with
`leadInput` from `@/lib/validation/lead` and calls `createLead` from `@/server/services/leads`. The shared request
flow is described in [../README.md](../README.md).

# src/app/api/intake/case/

`route.ts`: `POST /api/intake/case`, the public endpoint behind the contact form. It validates with `caseInput`
from `@/lib/validation/case` and calls `createCase` from `@/server/services/cases`. The shared request flow is
described in [../README.md](../README.md).

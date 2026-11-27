# src/app/api/intake/

The site's two public endpoints. The forms POST JSON here, and each submission becomes a Person, an Organization
(if one was named) and a Lead or Service Case.

## Files

| File | What it does |
|---|---|
| `lead/route.ts` | `POST /api/intake/lead`: validates with `leadInput`, then `createLead` |
| `case/route.ts` | `POST /api/intake/case`: validates with `caseInput`, then `createCase` |
| `handleIntake.ts` | the request flow both routes share (below). Not a route: Next.js only serves `route.ts`. |

Only `POST` is exported, so any other method gets `405` from Next.js.

## Request flow

1. Parse the JSON body with the form's Zod schema. Bad JSON: `400 { ok: false, error: 'invalid_json' }`. Invalid
   fields: `400 { ok: false, error: 'invalid_input', fieldErrors: { email: ['…'] } }`.
2. Honeypot (`website`) filled: `200 { ok: true, name }`, the same as a success, and nothing is stored.
3. Rate limit: at most 5 submissions per salted IP hash per 10 minutes, across both endpoints.
   Over it: `429 { ok: false, error: 'rate_limited' }`. The IP is the first `x-forwarded-for` entry, which Vercel
   sets; behind another proxy, make sure that header can't be set by the client.
4. Call the service, which writes everything in one transaction.
   Success: `200 { ok: true, name }`. Any failure: `500 { ok: false, error: 'server_error' }`. The Person's
   `consent_at` is the submission time.

Logs carry record ids (`leadId`, `caseId`, `personId`, `organizationId`) and error names or Postgres codes only,
never form contents or database messages.

## Trying it locally

```bash
curl -s -XPOST localhost:3000/api/intake/lead -H 'content-type: application/json' \
  -d '{"name":"Ana Silva","email":"ana@example.org","phone":"+55 81 99999-0000"}'
curl -s -XPOST localhost:3000/api/intake/case -H 'content-type: application/json' \
  -d '{"name":"Ana Silva","email":"ana@example.org","phone":"+55 81 99999-0000","message":"How much does it cost?"}'
```

Name, email and phone are required on both; a case also needs a message. `organizationName`, `message` (lead),
`subject` (case) and `sourcePage` are optional.

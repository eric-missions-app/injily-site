# src/app/api/auth/

Admin sign-in. `[...nextauth]/route.ts` hands every `/api/auth/*` request to Auth.js (`handlers` from
`@/server/auth`), which serves:

| URL | What it does |
|---|---|
| `/api/auth/signin` | the sign-in page: enter an email, get a magic link (middleware sends signed-out `/admin` visitors here) |
| `/api/auth/verify-request` | "Check your email". Shown for every request, so it doesn't reveal who's on the allow-list. |
| `/api/auth/callback/resend` | the link in the email; signs the admin in and returns to where they were going |
| `/api/auth/signout`, `/api/auth/session` | sign out; the current session |

The config (Resend provider, `ADMIN_EMAILS` allow-list, JWT sessions) lives in `src/server/auth.ts`.

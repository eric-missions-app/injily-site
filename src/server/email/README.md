# src/server/email/

Sending email through Resend, and the email templates. Server-only: every file starts with `import 'server-only';`.
Only `src/server/services/` calls into it.

## Files

| File / folder | What it holds |
|---|---|
| `client.ts` | `sendEmail(email, recordId)`: sends one email through Resend with `RESEND_API_KEY`, from `EMAIL_FROM`, and returns whether it was sent. It never throws. A request still unanswered after 5 seconds is aborted and logged as `email failed` with `timeout`. Without a key (local dev) it sends nothing and logs `email skipped` with the record id. A failure is logged as `email failed` with the record id and Resend's error name, and returns false. |
| `templates/` | the intake emails (team notification, visitor confirmation), see [templates/README.md](templates/README.md) |

## Rules

- **An email never fails a submission.** Services send only after their transaction commits, and `sendEmail`
  swallows and logs every error.
- **Log only the record id and an error name.** Never an address, a name or a message, and never Resend's error
  message (it can quote an address).
- Templates are plain HTML with a text version: no styles, images, tracking pixels or links other than the admin link.
  Every visitor-supplied value is escaped.

## Adding an email

1. Add a template under `templates/` that returns `{ subject, html, text }`.
2. Call `sendEmail({ to, ...template(…) }, recordId)` from a service, after its transaction commits.
3. If it's about a Lead or Service Case, write an `email` activity on it when `sendEmail` returns true.

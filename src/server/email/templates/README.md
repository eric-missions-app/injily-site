# src/server/email/templates/

The emails intake sends. Each template takes an `IntakeRecord` (the record's kind and id plus the parsed form input)
and returns `{ subject, html, text }`; the caller adds `to`.

## Files

| File | What it holds |
|---|---|
| `teamNotification.ts` | `teamNotification(record)`: the email to `TEAM_INBOX`. Subject `New lead: {name} ({organization})` or `New service case: {subject, else name}`. Lists the type, the subject (cases, if given), name, email, phone, organization and message, with a link to `${NEXT_PUBLIC_SITE_URL}/admin/leads/<id>` or `/admin/cases/<id>`. |
| `visitorConfirmation.ts` | `visitorConfirmation(record)`: the email to the visitor. "Thanks, {first word of name}. We got your message and someone from our team will follow up shortly." plus a summary of what they sent (the case's subject, if given, and organization). |
| `shared.ts` | the `IntakeRecord` type, `escapeHtml`, and helpers for the label/value rows and the plain HTML document |

## Rules

- Plain HTML (no styles, images or tracking) and a text version with the same content.
- The visitor confirmation goes from our domain to an unverified address. It never includes the free-text message, and
  every visitor-supplied value in it (the greeting's name included) is put on one line and cut to 80 characters. The full text is
  in the team notification and the admin.
- Escape every visitor-supplied value with `escapeHtml` / `htmlText`. Rows without a value are left out.

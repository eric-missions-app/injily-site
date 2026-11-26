import 'server-only';
import type { NextAuthConfig } from 'next-auth';

/** The `ADMIN_EMAILS` allow-list, lowercased. Read on every call, so a changed variable applies on the next request. */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): email is string {
  return !!email && adminEmails().includes(email.trim().toLowerCase());
}

/**
 * The part of the Auth.js config that runs in middleware (the Edge runtime): no database adapter and no email
 * provider, only what's needed to read the session cookie. `auth.ts` extends it with both.
 */
export const authConfig = {
  providers: [],
  // Sessions are signed JWT cookies, so there's no sessions table and middleware can check them without a database.
  session: { strategy: 'jwt' },
  callbacks: {
    // Middleware: let a request through only with a session for an address that's still on the allow-list.
    // Returning false redirects to the sign-in page.
    authorized({ auth }) {
      return isAdminEmail(auth?.user?.email);
    },
  },
} satisfies NextAuthConfig;

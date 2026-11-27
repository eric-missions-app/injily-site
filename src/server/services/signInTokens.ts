import 'server-only';
import { eq } from 'drizzle-orm';
import type { Adapter } from 'next-auth/adapters';
import { getDb } from '@/server/db/client';
import { verificationTokens } from '@/server/db/schema';

/**
 * The Auth.js adapter for email magic links. It stores only the link tokens: admins aren't saved anywhere (they're
 * the addresses in ADMIN_EMAILS) and sessions are JWT cookies, so there are no users or sessions to look up.
 */
export const signInTokenAdapter: Adapter = {
  async createVerificationToken(token) {
    await getDb().insert(verificationTokens).values(token);
    return token;
  },

  // One use per link: the row is deleted as it's read. The token is unique; Auth.js then checks that the
  // identifier matches the link's email.
  async useVerificationToken({ token }) {
    const [row] = await getDb()
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token))
      .returning();
    return row ? { identifier: row.identifier, token: row.token, expires: row.expires } : null;
  },

  // No stored users: Auth.js then calls createUser, which hands the user straight back into the session.
  async getUserByEmail() {
    return null;
  },

  async createUser(user) {
    return user;
  },
};

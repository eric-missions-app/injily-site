import 'server-only';
import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
import { redirect } from 'next/navigation';
import { authConfig, isAdminEmail } from './auth.config';
import { signInTokenAdapter } from './services/signInTokens';

/** Where a request for an address that isn't on the allow-list ends up: the same page a real request shows. */
const CHECK_YOUR_EMAIL = '/api/auth/verify-request?provider=resend&type=email';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: signInTokenAdapter,
  providers: [
    Resend({
      // The sign-in page's button reads "Sign in with Email".
      name: 'Email',
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    signIn({ user, email }) {
      if (isAdminEmail(user.email)) return true;
      // Not on the allow-list. When a link is requested, send nothing and show the same "check your email" page,
      // so the form doesn't reveal which addresses are admins. A link that was sent before the address was
      // removed is refused.
      return email?.verificationRequest ? CHECK_YOUR_EMAIL : false;
    },
  },
});

/**
 * The signed-in admin's email, lowercased. Every admin page and Server Action calls this first; without a session
 * for an allow-listed address it redirects to sign-in and nothing after it runs.
 */
export async function requireAdmin(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email;
  if (!isAdminEmail(email)) redirect('/api/auth/signin');
  return email.trim().toLowerCase();
}

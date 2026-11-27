import NextAuth from 'next-auth';
import { authConfig } from '@/server/auth.config';

// Any /admin/* request without a session for an allow-listed address is redirected to sign-in
// (see `authorized` in auth.config.ts). Admin pages and Server Actions check the session again themselves.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ['/admin/:path*'],
};

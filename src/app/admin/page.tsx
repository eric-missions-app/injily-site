import { redirect } from 'next/navigation';
import { requireAdmin } from '@/server/auth';

/** /admin itself has no screen of its own; it opens the Leads list. */
export default async function AdminHome() {
  await requireAdmin();
  redirect('/admin/leads');
}

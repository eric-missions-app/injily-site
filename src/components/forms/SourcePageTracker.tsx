'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { rememberPath } from './sourcePage';

/** Renders nothing; records each path the visitor visits so `LeadForm` can send the page they came from. */
export default function SourcePageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    rememberPath(pathname);
  }, [pathname]);

  return null;
}

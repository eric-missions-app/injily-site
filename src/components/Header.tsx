'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { CTA_HREF, CTA_LABEL, NAV_GROUPS, NAV_LINKS, SITE_NAME } from '@/lib/site';

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
const ctaClass = `inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover ${focusRing}`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        // The panel unmounts; put focus back on its button instead of letting it drop to <body>.
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`rounded-md text-2xl font-extrabold tracking-tight text-text ${focusRing}`}
        >
          {SITE_NAME}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-2 md:flex">
          {NAV_GROUPS.map((group) => (
            <DropdownMenu key={group.label} group={group} />
          ))}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-semibold text-text transition-colors hover:text-primary ${focusRing}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href={CTA_HREF} className={ctaClass}>
            {CTA_LABEL}
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((value) => !value)}
          className={`flex h-10 w-10 items-center justify-center rounded-md text-2xl text-text md:hidden ${focusRing}`}
        >
          <span aria-hidden="true" className="material-symbols-outlined">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden border-t border-border bg-background md:hidden"
          >
            <div className="space-y-6 px-4 py-6 sm:px-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted">
                    {group.label}
                  </p>
                  <ul className="mt-2">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={`block rounded-lg px-3 py-2 text-base text-text hover:bg-background-light hover:text-primary ${focusRing}`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <ul>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={`block rounded-lg px-3 py-2 text-base font-semibold text-text hover:bg-background-light hover:text-primary ${focusRing}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={CTA_HREF} onClick={closeMenu} className={`${ctaClass} w-full py-3 text-base`}>
                {CTA_LABEL}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

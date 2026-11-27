/**
 * The page the visitor was on before the current one, for a lead's `sourcePage`.
 *
 * Client-side navigation (`next/link`) never updates `document.referrer`, so `SourcePageTracker` (in the root
 * layout) records each path as the visitor moves around. Module state lives for one page load only, so a full
 * reload starts empty and falls back to a same-origin `document.referrer`.
 */
let currentPath: string | null = null;
let previousPath: string | null = null;

/** Called by `SourcePageTracker` whenever the path changes. */
export function rememberPath(pathname: string) {
  if (pathname === currentPath) return;
  previousPath = currentPath;
  currentPath = pathname;
}

/** The path of the page before this one on this site, or `undefined` if the visitor came from elsewhere. */
export function referringPath(): string | undefined {
  if (previousPath) return previousPath;
  if (!document.referrer) return undefined;
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin !== window.location.origin || referrer.pathname === window.location.pathname) {
      return undefined;
    }
    return referrer.pathname;
  } catch {
    return undefined;
  }
}

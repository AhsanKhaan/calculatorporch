'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Header category nav with an active state, plus instant click feedback.
 * - Active: `aria-current="page"` on an exact match, `aria-current="true"` when the page sits under that category
 *   (e.g. /construction/gravel-calculator/ highlights Construction). usePathname() also works during the static
 *   export, so the active link is in the HTML (no flash).
 * - Feedback: client navigations keep the old page on screen until the new one has rendered, which on a slow phone
 *   can take a second and feels like the click did nothing. On an internal link click we set html[data-nav] at once,
 *   so CSS shows a progress bar in the very next frame; it's cleared when the pathname changes.
 */
export default function NavLinks({ links }: { links: readonly { href: string; label: string; className?: string }[] }) {
  const pathname = usePathname() ?? '/';
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.removeAttribute('data-nav');
    // On phones the nav is one horizontally scrolling row: bring the active category into view.
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current]');
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
    const a = active.getBoundingClientRect();
    const r = nav.getBoundingClientRect();
    nav.scrollLeft += a.left + a.width / 2 - (r.left + r.width / 2);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!(a instanceof HTMLAnchorElement) || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      // Same-page links (e.g. "On this page" #anchors) and other origins don't trigger a route change.
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      document.documentElement.setAttribute('data-nav', '');
      // Safety net: never leave the bar up if a navigation fails or is cancelled.
      window.setTimeout(() => document.documentElement.removeAttribute('data-nav'), 10_000);
    };
    // Capture phase: next/link calls preventDefault() in its own click handler, so a bubbling listener would never see it.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return (
    <nav aria-label="Categories" className="nav" ref={navRef}>
      {links.map((l) => {
        const exact = pathname === l.href;
        const within = !exact && l.href !== '/' && pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={l.className} aria-current={exact ? 'page' : within ? 'true' : undefined}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

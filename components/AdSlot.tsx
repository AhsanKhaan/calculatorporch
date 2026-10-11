'use client';

import { useEffect, useState } from 'react';
import { adsAllowed } from '@/lib/ads';
import { SITE } from '@/content/site';

/**
 * Reserved ad slot (docs/04 §1, SEC-CODE-22). Renders NOTHING unless all three locks in lib/ads.ts hold.
 * No ad script exists in this codebase yet: ads are added only after the playbook §0.2 gate, with the
 * phase D CSP (security/02 §5). Never place it inside or between calculator inputs and the result.
 */
export default function AdSlot({ minHeight = 280 }: { minHeight?: number }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // Decided in the browser: hostname and webdriver aren't known at build time.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser-only facts
    setAllowed(
      adsAllowed({
        enabledFlag: process.env.NEXT_PUBLIC_ADS_ENABLED,
        hostname: window.location.hostname,
        productionHost: SITE.host,
        webdriver: navigator.webdriver === true,
      }),
    );
  }, []);

  if (!allowed) return null;
  return <aside aria-label="Advertisement" className="ad-slot" style={{ minHeight }} />;
}

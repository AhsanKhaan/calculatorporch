/**
 * Reserved ad slot (docs/04 §1 and §8, SEC-CODE-22, SEC-ADS-05). Server-rendered, so the box and its height are in the
 * static HTML and a filled ad never shifts the page (CLS ≤ 0.05). The previous client-only version inserted the box
 * after hydration, which would have shifted every page once ads were switched on.
 *
 * - While NEXT_PUBLIC_ADS_ENABLED isn't exactly "true" (every build before the playbook §0.2 gate), it renders NOTHING:
 *   no empty boxes, no "ad" placeholders.
 * - No ad script exists in this codebase. When ads go live, the AdSense unit goes inside this box, and its loader must
 *   also pass the browser-side locks in lib/ads.ts (production host, not webdriver) before requesting an ad.
 * - Never place it inside or between the calculator inputs and the result.
 *
 * Variants: "inline" = responsive in-content unit (280 px reserved); "rail" = 300×600 desktop sidebar (hidden < 1100 px).
 */
export type AdVariant = 'inline' | 'rail';

export const adsBuildEnabled = (): boolean => process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

export default function AdSlot({ id, variant = 'inline' }: { id: string; variant?: AdVariant }) {
  if (!adsBuildEnabled()) return null;
  return (
    <aside aria-label="Advertisement" className={`ad-slot ad-slot--${variant}`} data-ad-slot-id={id}>
      <span className="ad-label">Advertisement</span>
    </aside>
  );
}

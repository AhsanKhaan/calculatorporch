/**
 * The ads switch (SEC-CODE-22, SEC-ADS-02). Ads may load only when ALL three locks hold:
 *  1. NEXT_PUBLIC_ADS_ENABLED is exactly "true" (set only in Cloudflare Production, only after the §0.2 gate);
 *  2. the page is on the production host (never previews, pages.dev or localhost);
 *  3. the browser isn't automated (Playwright, Lighthouse, crawlers driven by webdriver).
 */
export interface AdsContext {
  enabledFlag: string | undefined;
  hostname: string;
  productionHost: string;
  webdriver: boolean;
}

export function adsAllowed(ctx: AdsContext): boolean {
  return ctx.enabledFlag === 'true' && ctx.hostname === ctx.productionHost && !ctx.webdriver;
}

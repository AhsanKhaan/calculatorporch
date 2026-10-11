import { readFileSync } from 'node:fs';
import { expect, test, type ConsoleMessage, type Page } from '@playwright/test';

// Pages come from the built sitemap, so every new calculator is covered automatically.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculatorporch.com').replace(/\/+$/, '');
const urls = [...readFileSync('out/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.replace(SITE, ''));
const NON_CATEGORY = new Set(['about', 'methodology', 'privacy', 'disclosure', 'contact', 'calculators', 'editorial-policy', 'authors']);
const segs = (u: string) => u.split('/').filter(Boolean);
const tools = urls.filter((u) => segs(u).length === 2 && !NON_CATEGORY.has(segs(u)[0]!));
const instances = urls.filter((u) => segs(u).length === 3);
const AD_HOSTS = /googlesyndication\.com|doubleclick\.net|googleadservices\.com|adservice\.google/;

function watch(page: Page) {
  const problems: string[] = [];
  const adRequests: string[] = [];
  const notFound: string[] = [];
  page.on('console', (m: ConsoleMessage) => {
    if (m.type() === 'error' || /Content Security Policy/i.test(m.text())) problems.push(`[${m.type()}] ${m.text()} @ ${m.location().url}`);
  });
  page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));
  page.on('request', (r) => {
    if (AD_HOSTS.test(r.url())) adRequests.push(r.url());
  });
  page.on('response', (r) => {
    if (r.status() === 404) notFound.push(r.url());
  });
  return { problems, adRequests, notFound };
}

test('the sitemap lists calculators and instances', () => {
  expect(tools.length).toBeGreaterThanOrEqual(10);
  expect(instances.length).toBeGreaterThanOrEqual(9);
});

for (const url of tools) {
  test(`calculator ${url}: static result, no URL changes, hostile params ignored`, async ({ page, request }) => {
    const html = await (await request.get(url)).text();
    expect(html, 'default result in static HTML (docs/04 §5)').toMatch(/data-testid="primary-result"[^>]*>[^<]*[0-9A-Za-z]/);
    expect(html).toContain('application/ld+json');
    expect(html).toContain('"FAQPage"');

    const w = watch(page);
    await page.goto(url);
    await page.locator('[data-hydrated="true"]').first().waitFor();
    const primary = page.getByTestId('primary-result');
    await expect(primary).toBeVisible();
    const before = { url: page.url(), length: await page.evaluate(() => history.length), text: await primary.textContent() };

    // Type into the first number input (most tools); the URL and history must not change (SEC-CODE-09).
    const num = page.locator('form input[type="number"]').first();
    if (await num.count()) {
      const current = await num.inputValue();
      await num.fill(String(Number(current || '1') + 1));
      expect(page.url()).toBe(before.url);
      expect(await page.evaluate(() => history.length)).toBe(before.length);
    }

    // Hostile query params: nothing executes, defaults stay (SEC-CODE-05/08).
    await page.goto(`${url}?__proto__[x]=1&constructor=1&a=%3Cimg%20src%3Dx%20onerror%3Dwindow.pwned%3D1%3E&min=%3Cscript%3E&data=1e999&date=2026-02-30`);
    await expect(primary).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { pwned?: number }).pwned)).toBeUndefined();
    expect(await page.locator('img[src="x"]').count()).toBe(0);
    await expect(primary).not.toContainText('NaN');
    expect(w.problems).toEqual([]);
    expect(w.adRequests).toEqual([]);
  });
}

for (const url of instances) {
  test(`instance ${url}: answer in static HTML and a link to its parent`, async ({ request }) => {
    const html = await (await request.get(url)).text();
    expect(html).toMatch(/data-testid="instance-answer"[^>]*>[^<]+</);
    const parent = `/${segs(url)[0]}/${segs(url)[1]}/`;
    expect(html).toContain(`href="${parent}"`);
  });
}

test('fraction: typing updates the answer and shows the working', async ({ page }) => {
  await page.goto('/math/fraction-calculator/');
  await page.locator('[data-hydrated="true"]').first().waitFor();
  await page.getByLabel('First fraction').fill('2 1/3');
  await page.getByLabel('Operation').selectOption('-');
  await expect(page.getByTestId('primary-result')).toHaveText('5/3');
  await expect(page.getByText('As a mixed number: 5/3 = 1 2/3.')).toBeVisible();
});

test('random number generator: Generate produces numbers in range', async ({ page }) => {
  await page.goto('/statistics/random-number-generator/1-to-16/');
  await page.locator('[data-hydrated="true"]').first().waitFor();
  await page.getByRole('button', { name: 'Generate' }).click();
  const n = Number(await page.getByTestId('primary-result').textContent());
  expect(n).toBeGreaterThanOrEqual(1);
  expect(n).toBeLessThanOrEqual(16);
});

test('client-side navigation works and prefetches hit (no 404s, no console errors)', async ({ page }) => {
  const w = watch(page);
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'Gravel Calculator' }).first().click();
  await expect(page).toHaveURL(/\/construction\/gravel-calculator\/$/);
  await expect(page.getByTestId('primary-result')).toContainText('cubic yards');
  await page.getByRole('navigation', { name: 'Categories', exact: true }).getByRole('link', { name: 'Math', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Math Calculators' })).toBeVisible();
  await page.waitForLoadState('networkidle');
  expect(w.notFound).toEqual([]);
  expect(w.problems).toEqual([]);
});

test('every page: no ad requests, no CSP violations, no horizontal scroll at 375 px', async ({ page }) => {
  const w = watch(page);
  await page.setViewportSize({ width: 375, height: 812 });
  for (const url of [...urls, '/does-not-exist/']) {
    await page.goto(url);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, url).toBeLessThanOrEqual(0);
  }
  expect(w.adRequests).toEqual([]);
  expect(w.problems.filter((p) => !/404|Failed to load resource/.test(p))).toEqual([]);
});

test('llms.txt and security headers are served', async ({ request }) => {
  const llms = await (await request.get('/llms.txt')).text();
  expect(llms).toMatch(/^# Calculator Porch/);
  for (const t of tools) expect(llms).toContain(t);
  const res = await request.get(tools[0]!);
  expect(res.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(res.headers()['x-content-type-options']).toBe('nosniff');
});

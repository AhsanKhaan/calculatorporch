export const money = (v: number | null): string => (v === null ? 'n/a' : `$${v.toFixed(2)}`);

export const cents = (v: number): string => `${v.toFixed(2)}¢`;

/** Stable fragment id for an H2 ("Tons of gravel per 100 sq ft" → "tons-of-gravel-per-100-sq-ft"), for "On this page" links. */
export const anchorId = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

const NUMERIC_CELL = /^[-−+]?\$?\d[\d,]*(?:\.\d+)?(?:\/\d+)?\s?[%¢]?$/;

/** Which table columns hold only numbers (right-aligned, tabular figures); text columns stay left-aligned. */
export const numericColumns = (rows: readonly (readonly (string | number)[])[]): boolean[] =>
  (rows[0] ?? []).map((_, j) => rows.every((r) => typeof r[j] === 'number' || NUMERIC_CELL.test(String(r[j] ?? '').trim())));

/** Count words the way the content checks do (docs/04 §6: direct answer 40–60 words). */
export const wordCount = (s: string): number => (s.match(/[a-z0-9$%][\w$.%'’-]*/gi) ?? []).length;

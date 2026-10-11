import type { OutputDef } from './spec';

const DATE_FMT = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export function formatOutput(def: OutputDef, v: number | string | null | undefined): string {
  if (v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v))) return 'n/a';
  if (typeof v === 'string') return def.format === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? DATE_FMT.format(new Date(`${v}T00:00:00Z`)) : v;
  const d = def.decimals ?? (def.format === 'integer' ? 0 : 2);
  const n = v.toLocaleString('en-US', { minimumFractionDigits: def.format === 'currency' ? 2 : 0, maximumFractionDigits: d });
  switch (def.format) {
    case 'currency':
      return `${v < 0 ? '−' : ''}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'percent':
      return `${n}%`;
    default:
      return def.suffix ? `${n} ${def.suffix}` : n;
  }
}

/** Format a calendar date (YYYY-MM-DD) for prose, timezone-safe. */
export const longDate = (iso: string): string => DATE_FMT.format(new Date(`${iso}T00:00:00Z`));

const SHORT_DATE_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
/** "Oct 11, 2026": review, update and access dates in text (docs/05 §3). */
export const shortDate = (iso: string): string => SHORT_DATE_FMT.format(new Date(`${iso}T00:00:00Z`));

/** Add days to an ISO date (UTC arithmetic, no DST issues). */
export function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Whole days between two ISO dates (b − a). */
export const daysBetweenIso = (a: string, b: string): number =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

/** Today's date in the visitor's local time zone, as YYYY-MM-DD. */
export function localTodayIso(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

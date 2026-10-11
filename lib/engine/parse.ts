/**
 * Input handling for every calculator (written once, used by all):
 * - SEC-CODE-05/06: query params are read only for the spec's own field keys, each validated; never spread.
 * - SEC-CODE-07: numbers are bounded; invalid or out-of-range input is flagged and replaced or clamped, never NaN.
 * - SEC-CODE-23: CSV goes through lib/csv.ts.
 */
import type { CalculatorSpec, Field, Values } from './spec';

export type RawState = Record<string, string>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RAW = 2000; // longest raw value accepted from a URL (numberList)

export const isValidIsoDate = (s: string): boolean => {
  if (!ISO_DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};

const RELATIVE = /^today(?:([+-])(\d{1,5}))?$/;

/** 'today', 'today+N', 'today-N' → ISO date relative to `today`; anything else is returned as is. */
export function resolveDate(spec: string, today: string): string {
  const m = RELATIVE.exec(spec);
  if (!m) return spec;
  const d = new Date(`${today}T00:00:00Z`);
  if (m[1] && m[2]) d.setUTCDate(d.getUTCDate() + (m[1] === '-' ? -1 : 1) * Number(m[2]));
  return d.toISOString().slice(0, 10);
}

export const resolveDefault = (f: Field, today: string): string => (f.type === 'date' ? resolveDate(f.default, today) : String(f.default));

export function defaultState(spec: CalculatorSpec, today: string): RawState {
  const s: RawState = {};
  for (const f of spec.fields) s[f.key] = resolveDefault(f, today);
  return s;
}

/** Parse one raw value. Returns the value to compute with and whether the raw input was valid. */
export function parseField(f: Field, raw: string, today: string): { value: number | string | number[]; valid: boolean } {
  const fallback = resolveDefault(f, today);
  const r = raw.trim();
  switch (f.type) {
    case 'number': {
      const n = r === '' ? Number.NaN : Number(r);
      if (Number.isFinite(n) && n >= f.min && n <= f.max) return { value: n, valid: true };
      return { value: Number.isFinite(n) ? Math.min(f.max, Math.max(f.min, n)) : f.default, valid: false };
    }
    case 'select': {
      const opt = f.options.find((o) => o.value === r);
      return opt ? { value: opt.value, valid: true } : { value: f.default, valid: false };
    }
    case 'date': {
      if (f.optional && r === '') return { value: '', valid: true };
      const ok = isValidIsoDate(r) && (!f.min || r >= f.min) && (!f.max || r <= f.max);
      return ok ? { value: r, valid: true } : { value: fallback, valid: false };
    }
    case 'text': {
      const ok = r.length > 0 && r.length <= f.maxLength && f.pattern.test(r);
      return ok ? { value: r, valid: true } : { value: f.default, valid: false };
    }
    case 'numberList': {
      const parts = r.split(/[\s,;]+/).filter(Boolean);
      const nums = parts.map(Number).filter((n) => Number.isFinite(n) && n >= f.min && n <= f.max);
      const valid = parts.length > 0 && nums.length === parts.length && nums.length <= f.maxItems;
      const kept = nums.slice(0, f.maxItems);
      return { value: kept.length ? kept : fallback.split(/[\s,;]+/).map(Number), valid };
    }
  }
}

export function parseAll(spec: CalculatorSpec, state: RawState, today: string): { values: Values; invalid: string[] } {
  const values: Values = {};
  const invalid: string[] = [];
  for (const f of spec.fields) {
    const { value, valid } = parseField(f, state[f.key] ?? resolveDefault(f, today), today);
    values[f.key] = value;
    if (!valid) invalid.push(f.key);
  }
  return { values, invalid };
}

/**
 * Shared link → state. Only the spec's field keys are read (allow-list); a value is used only if it validates,
 * otherwise the default stays. Nothing else in the URL is read or echoed (SEC-CODE-05/08).
 */
export function stateFromQuery(spec: CalculatorSpec, search: string, today: string): RawState {
  const params = new URLSearchParams(search);
  const state = defaultState(spec, today);
  for (const f of spec.fields) {
    const raw = params.get(f.key);
    if (raw === null || raw.length > MAX_RAW) continue;
    if (parseField(f, raw, today).valid) state[f.key] = raw.trim();
  }
  return state;
}

export function queryFromState(spec: CalculatorSpec, state: RawState): string {
  const params = new URLSearchParams();
  for (const f of spec.fields) params.set(f.key, state[f.key] ?? '');
  return params.toString();
}

/** Apply a field change plus any linked updates declared in spec.onChange (only known keys). */
export function applyChange(spec: CalculatorSpec, state: RawState, key: string, value: string): RawState {
  if (!spec.fields.some((f) => f.key === key)) return state;
  const next: RawState = { ...state, [key]: value };
  const link = spec.onChange?.[key];
  if (link) {
    const updates = link(value, next);
    for (const f of spec.fields) if (Object.prototype.hasOwnProperty.call(updates, f.key)) next[f.key] = String(updates[f.key]);
  }
  return next;
}

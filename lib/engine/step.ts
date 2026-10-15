import type { NumberField } from './spec';

/** One −/+ stepper press: move by `step`, clamp to min/max, and round away float noise (0.1 + 0.2). */
export function stepValue(f: NumberField, raw: string, dir: 1 | -1): string {
  const decimals = (String(f.step).split('.')[1] ?? '').length;
  const n = Number(raw);
  const from = raw.trim() !== '' && Number.isFinite(n) ? n : f.default;
  const next = Math.min(f.max, Math.max(f.min, from + dir * f.step));
  return String(Number(next.toFixed(decimals)));
}

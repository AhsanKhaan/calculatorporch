/**
 * Fraction arithmetic with exact integers (no floating-point rounding in the fraction result).
 * Inputs: integers ("5"), fractions ("2/3", "-3/4"), mixed numbers ("2 1/3", "-1 1/2") and short decimals ("0.25").
 * Bounded to 6 digits per part so every intermediate product stays far below 2^53 (SEC-CODE-07).
 */
export interface Frac {
  n: number; // numerator (sign carried here)
  d: number; // denominator > 0
}

export const FRACTION_PATTERN = /^-?\d{1,6}(?:\s+\d{1,6}\/\d{1,6}|\/\d{1,6}|\.\d{1,6})?$/;

export const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

export const simplify = (f: Frac): Frac => {
  const g = gcd(f.n, f.d);
  const s = f.d < 0 ? -1 : 1;
  return { n: (s * f.n) / g, d: (s * f.d) / g };
};

/** Parse a fraction, mixed number, integer or short decimal. Returns null if it isn't one, or the denominator is 0. */
export function parseFraction(input: string): Frac | null {
  const s = input.trim().replace(/\s+/g, ' ');
  if (!FRACTION_PATTERN.test(s)) return null;
  const neg = s.startsWith('-');
  const body = neg ? s.slice(1) : s;
  let f: Frac;
  if (body.includes('.')) {
    const [i, dec] = body.split('.') as [string, string];
    const d = 10 ** dec.length;
    f = { n: Number(i) * d + Number(dec), d };
  } else if (body.includes(' ')) {
    const [whole, frac] = body.split(' ') as [string, string];
    const [n, d] = frac.split('/').map(Number) as [number, number];
    if (d === 0) return null;
    f = { n: Number(whole) * d + n, d };
  } else if (body.includes('/')) {
    const [n, d] = body.split('/').map(Number) as [number, number];
    if (d === 0) return null;
    f = { n, d };
  } else {
    f = { n: Number(body), d: 1 };
  }
  return simplify(neg ? { n: -f.n, d: f.d } : f);
}

export const toMixed = (f: Frac): string => {
  const s = simplify(f);
  if (s.d === 1) return String(s.n);
  const sign = s.n < 0 ? '-' : '';
  const a = Math.abs(s.n);
  const whole = Math.floor(a / s.d);
  const rem = a % s.d;
  return whole ? `${sign}${whole} ${rem}/${s.d}` : `${sign}${rem}/${s.d}`;
};

export const toFractionString = (f: Frac): string => {
  const s = simplify(f);
  return s.d === 1 ? String(s.n) : `${s.n}/${s.d}`;
};

/** How the user typed it, as an improper fraction string (for steps). */
const improper = (f: Frac) => `${f.n}/${f.d}`;

export type Op = '+' | '-' | '×' | '÷';
export const OPS: readonly Op[] = ['+', '-', '×', '÷'];
export const OP_WORD: Record<Op, string> = { '+': 'plus', '-': 'minus', '×': 'times', '÷': 'divided by' };

export interface FractionResult {
  result: Frac | null;
  steps: string[];
  error?: string;
}

/** a op b, with the working a student would write down. */
export function operate(a: Frac, op: Op, b: Frac, aText = toMixed(a), bText = toMixed(b)): FractionResult {
  const steps: string[] = [];
  if (aText.includes(' ') || bText.includes(' ')) steps.push(`Convert mixed numbers to improper fractions: ${aText} = ${improper(a)}, ${bText} = ${improper(b)}.`);
  let raw: Frac;
  switch (op) {
    case '+':
    case '-': {
      const d = (a.d * b.d) / gcd(a.d, b.d); // least common denominator
      const an = a.n * (d / a.d);
      const bn = b.n * (d / b.d);
      steps.push(`Use the common denominator ${d}: ${improper(a)} = ${an}/${d} and ${improper(b)} = ${bn}/${d}.`);
      raw = { n: op === '+' ? an + bn : an - bn, d };
      steps.push(`${op === '+' ? 'Add' : 'Subtract'} the numerators: ${an} ${op === '+' ? '+' : '−'} ${bn} = ${raw.n}, so the result is ${raw.n}/${d}.`);
      break;
    }
    case '×':
      raw = { n: a.n * b.n, d: a.d * b.d };
      steps.push(`Multiply the numerators and the denominators: (${a.n} × ${b.n}) / (${a.d} × ${b.d}) = ${raw.n}/${raw.d}.`);
      break;
    case '÷':
      if (b.n === 0) return { result: null, steps, error: "You can't divide by zero." };
      steps.push(`Dividing by ${improper(b)} is the same as multiplying by its reciprocal, ${b.d}/${b.n}.`);
      raw = { n: a.n * b.d, d: a.d * b.n };
      steps.push(`Multiply: (${a.n} × ${b.d}) / (${a.d} × ${b.n}) = ${raw.n}/${raw.d}.`);
      break;
  }
  const s = simplify(raw);
  const g = gcd(raw.n, raw.d);
  if (g > 1 || raw.d < 0) steps.push(`Simplify by dividing top and bottom by ${g}: ${raw.n}/${raw.d} = ${toFractionString(s)}.`);
  if (Math.abs(s.n) > s.d && s.d !== 1) steps.push(`As a mixed number: ${toFractionString(s)} = ${toMixed(s)}.`);
  return { result: s, steps };
}

export const toDecimal = (f: Frac): number => f.n / f.d;

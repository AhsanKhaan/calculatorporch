'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/random-number.spec';

/** Client island for the "random-number" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function RandomNumberCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/fraction.spec';

/** Client island for the "fraction" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function FractionCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

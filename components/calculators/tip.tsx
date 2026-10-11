'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/tip.spec';

/** Client island for the "tip" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function TipCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

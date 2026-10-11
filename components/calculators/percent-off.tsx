'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/percent-off.spec';

/** Client island for the "percent-off" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function PercentOffCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

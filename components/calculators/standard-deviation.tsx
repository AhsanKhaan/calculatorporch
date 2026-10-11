'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/standard-deviation.spec';

/** Client island for the "standard-deviation" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function StandardDeviationCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

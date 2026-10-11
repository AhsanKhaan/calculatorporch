'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/days-from-date.spec';

/** Client island for the "days-from-date" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function DaysFromDateCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

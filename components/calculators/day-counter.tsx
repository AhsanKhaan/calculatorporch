'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/day-counter.spec';

/** Client island for the "day-counter" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function DayCounterCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

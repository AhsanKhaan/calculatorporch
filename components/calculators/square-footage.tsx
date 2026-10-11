'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/square-footage.spec';

/** Client island for the "square-footage" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function SquareFootageCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

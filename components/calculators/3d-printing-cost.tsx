'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/3d-printing-cost.spec';

/** Client island for the "3d-printing-cost" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function ThreeDPrintingCostCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

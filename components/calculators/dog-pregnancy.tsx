'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/dog-pregnancy.spec';

/** Client island for the "dog-pregnancy" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function DogPregnancyCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

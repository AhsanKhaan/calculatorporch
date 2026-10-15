'use client';

import CalculatorEngine from '@/components/engine/CalculatorEngine';
import spec from '@/lib/calculators/solar-panel.spec';

/** Client island for the "solar-panel" calculator: imports only its own spec, so each page ships one calculator's code. */
export default function SolarPanelCalculator(props: { buildToday: string; initial?: Readonly<Record<string, string>> }) {
  return <CalculatorEngine spec={spec} {...props} />;
}

/** Server-only map: calculator id → build-time explainer. Used by tool pages and /llms-full.txt. */
import type { Explain } from '@/lib/engine/explain';
import explain3d from './3d-printing-cost.explain';
import explainDayCounter from './day-counter.explain';
import explainDog from './dog-pregnancy.explain';
import explainFraction from './fraction.explain';
import explainGravel from './gravel.explain';
import explainPercentOff from './percent-off.explain';
import explainRandom from './random-number.explain';
import explainSqft from './square-footage.explain';
import explainSolar from './solar-panel.explain';
import explainSd from './standard-deviation.explain';
import explainTip from './tip.explain';

export const EXPLAINS: Readonly<Record<string, () => Explain>> = {
  '3d-printing-cost': explain3d,
  fraction: explainFraction,
  'day-counter': explainDayCounter,
  'random-number': explainRandom,
  'percent-off': explainPercentOff,
  tip: explainTip,
  'standard-deviation': explainSd,
  'square-footage': explainSqft,
  gravel: explainGravel,
  'dog-pregnancy': explainDog,
  'solar-panel': explainSolar,
};

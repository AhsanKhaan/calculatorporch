// Test-only map: calculator id → spec (the client islands import their spec directly; tests need all of them).
import type { CalculatorSpec } from '@/lib/engine/spec';
import printCost from '@/lib/calculators/3d-printing-cost.spec';
import dayCounter from '@/lib/calculators/day-counter.spec';
import daysFromDate from '@/lib/calculators/days-from-date.spec';
import dog from '@/lib/calculators/dog-pregnancy.spec';
import fraction from '@/lib/calculators/fraction.spec';
import gravel from '@/lib/calculators/gravel.spec';
import percentOff from '@/lib/calculators/percent-off.spec';
import random from '@/lib/calculators/random-number.spec';
import sqft from '@/lib/calculators/square-footage.spec';
import sd from '@/lib/calculators/standard-deviation.spec';
import tip from '@/lib/calculators/tip.spec';

const specs: Readonly<Record<string, CalculatorSpec>> = {
  '3d-printing-cost': printCost,
  'day-counter': dayCounter,
  'days-from-date': daysFromDate,
  'dog-pregnancy': dog,
  fraction,
  gravel,
  'percent-off': percentOff,
  'random-number': random,
  'square-footage': sqft,
  'standard-deviation': sd,
  tip,
};
export default specs;

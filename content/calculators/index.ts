/** Every written tool content module. Add one line per new calculator. */
import type { ToolInput } from '../schema';
import printCost from './3d-printing-cost-calculator';
import dayCounter from './day-counter';
import dogPregnancy from './dog-pregnancy-calculator';
import fraction from './fraction-calculator';
import gravel from './gravel-calculator';
import percentOff from './percent-off-calculator';
import randomNumber from './random-number-generator';
import squareFootage from './square-footage-calculator';
import standardDeviation from './standard-deviation-calculator';
import tip from './tip-calculator';

export const TOOL_CONTENT: readonly ToolInput[] = [
  fraction,
  dayCounter,
  randomNumber,
  percentOff,
  tip,
  standardDeviation,
  squareFootage,
  gravel,
  dogPregnancy,
  printCost,
];

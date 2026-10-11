import dateOffset from './date-offset';
import fractionExpression from './fraction-expression';
import percentOff from './percent-off';
import randomRange from './random-range';
import { InstanceSchema, type Family, type InstancePage } from './types';

export const FAMILIES: Readonly<Record<string, Family>> = {
  'fraction-expression': fractionExpression,
  'date-offset': dateOffset,
  'random-range': randomRange,
  'percent-off': percentOff,
};

/** Build + validate an instance page. Throws (fails the build) if a published instance is malformed or thin. */
export function buildInstance(familyId: string, slug: string, today: string): InstancePage | null {
  const fam = FAMILIES[familyId];
  const raw = fam?.build(slug, { today });
  return raw ? InstanceSchema.parse(raw) : null;
}

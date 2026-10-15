/**
 * Server-side map: calculator id → client island, code-split per page with next/dynamic (still server-rendered,
 * so the default result is in the static HTML). Add one line per new calculator (CLAUDE.md "Adding a calculator").
 */
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export type IslandProps = { buildToday: string; initial?: Readonly<Record<string, string>> };

export const ISLANDS: Readonly<Record<string, ComponentType<IslandProps>>> = {
  '3d-printing-cost': dynamic(() => import('./3d-printing-cost')),
  fraction: dynamic(() => import('./fraction')),
  'day-counter': dynamic(() => import('./day-counter')),
  'days-from-date': dynamic(() => import('./days-from-date')),
  'random-number': dynamic(() => import('./random-number')),
  'percent-off': dynamic(() => import('./percent-off')),
  tip: dynamic(() => import('./tip')),
  'standard-deviation': dynamic(() => import('./standard-deviation')),
  'square-footage': dynamic(() => import('./square-footage')),
  gravel: dynamic(() => import('./gravel')),
  'dog-pregnancy': dynamic(() => import('./dog-pregnancy')),
  'solar-panel': dynamic(() => import('./solar-panel')),
};

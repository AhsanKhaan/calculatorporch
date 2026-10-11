/**
 * Server-rendered explainer content for a calculator (docs/05 §1 items 7–8). Built from the same pure functions the
 * calculator uses, at build time, so published numbers can't drift from the code. Lives in `<id>.explain.ts`, a
 * separate module from the spec, so this content never ships in the client bundle.
 */
export interface ExplainTable {
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly (string | number)[])[];
  note?: string;
}

export interface Explain {
  /** Formula lines, shown in a monospace block. */
  formula: readonly string[];
  /** A worked example in prose, using the calculator's own computed numbers. */
  example?: string;
  /** Original data tables (the information-gain asset). */
  tables?: readonly ExplainTable[];
  /** Extra sections, e.g. "Driveway gravel depth" or a week-by-week timeline. */
  sections?: readonly { heading: string; paragraphs: readonly string[] }[];
  assumptions?: readonly string[];
}

export const FORMULA_HEADING = 'Formula and worked example';
export const ASSUMPTIONS_HEADING = 'Assumptions and limits';

/**
 * The H2s the Explainer renders, in order, with their fragment ids. Each data table is its own H2 (its caption), so
 * "how many tons of gravel per 100 sq ft" lands on a passage headed by exactly that question's subject.
 */
export function explainHeadings(e: Explain, anchor: (s: string) => string): { id: string; heading: string }[] {
  return [
    { id: 'formula', heading: FORMULA_HEADING },
    ...(e.sections ?? []).map((s) => ({ id: anchor(s.heading), heading: s.heading })),
    ...(e.tables ?? []).map((t) => ({ id: anchor(t.caption), heading: t.caption })),
    ...(e.assumptions?.length ? [{ id: 'assumptions', heading: ASSUMPTIONS_HEADING }] : []),
  ];
}

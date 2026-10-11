/**
 * CalculatorSpec: the config format every calculator is written in (docs/10 §6, our version of Omni's Builder).
 * Specs are plain TypeScript modules with no DOM or I/O (SEC-CODE-10). One client island (CalculatorEngine)
 * renders any spec, so input safety (SEC-CODE-05/06/07/08/09/23) is implemented once, in lib/engine/parse.ts.
 */
interface BaseField {
  key: string;
  label: string;
  hint?: string;
  /** Fieldset heading the field appears under. */
  group?: string;
}
export interface NumberField extends BaseField {
  type: 'number';
  min: number;
  max: number;
  step: number;
  default: number;
  prefix?: string;
  suffix?: string;
}
export interface SelectField extends BaseField {
  type: 'select';
  options: readonly { value: string; label: string }[];
  default: string;
}
export interface DateField extends BaseField {
  type: 'date';
  /**
   * 'today', 'today+N' or 'today-N' resolve to the visitor's local date in the browser (the build date in static
   * HTML); otherwise a fixed YYYY-MM-DD.
   */
  default: string;
  min?: string;
  max?: string;
  /** Empty is allowed and passed to compute() as ''. */
  optional?: boolean;
}
export interface TextField extends BaseField {
  type: 'text';
  default: string;
  maxLength: number;
  /** Values that don't match are rejected (allow-list, SEC-CODE-05). */
  pattern: RegExp;
  placeholder?: string;
}
export interface NumberListField extends BaseField {
  type: 'numberList';
  default: string;
  maxItems: number;
  min: number;
  max: number;
}
export type Field = NumberField | SelectField | DateField | TextField | NumberListField;

/** Parsed, validated values passed to compute(). */
export type Values = Record<string, number | string | number[]>;

export type OutputFormat = 'number' | 'integer' | 'currency' | 'percent' | 'date' | 'text';
export interface OutputDef {
  key: string;
  label: string;
  format: OutputFormat;
  decimals?: number;
  suffix?: string;
  /** The headline result (shown large). Exactly one output should be primary. */
  primary?: boolean;
  /** Hide the row while compute() returns null for it (e.g. a cost before a price is entered), instead of "$0.00". */
  hideWhenNull?: boolean;
}

export interface ComputeContext {
  today: string;
}

export interface ComputeResult {
  values: Record<string, number | string | null>;
  /** Step-by-step working shown under the result. */
  steps?: string[];
  warnings?: string[];
}

export interface CalculatorSpec {
  id: string;
  fields: readonly Field[];
  outputs: readonly OutputDef[];
  /** `ctx.today` is the visitor's local date (the build date in static HTML). */
  compute: (v: Values, ctx: ComputeContext) => ComputeResult;
  /**
   * Field links: when `key` changes, return other raw values to set (e.g. a fee preset fills the fee fields).
   * Only keys that exist in `fields` are applied.
   */
  onChange?: Readonly<Record<string, (value: string, state: Readonly<Record<string, string>>) => Record<string, string>>>;
  /** A button that produces a fresh result (e.g. a random number generator). The static HTML shows `compute()`. */
  action?: { label: string; run: (v: Values, ctx: ComputeContext) => ComputeResult };
  csvName?: string;
}

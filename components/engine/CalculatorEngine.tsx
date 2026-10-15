'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CalculatorSpec, ComputeResult, Field, NumberField } from '@/lib/engine/spec';
import { applyChange, defaultState, parseAll, queryFromState, stateFromQuery, type RawState } from '@/lib/engine/parse';
import { formatOutput, localTodayIso } from '@/lib/engine/format';
import { stepValue } from '@/lib/engine/step';
import { toCsv } from '@/lib/csv';

/** Field shown now? (showWhen: another field's raw value must be one of the listed values.) */
const isShown = (f: Field, state: RawState): boolean => !f.showWhen || f.showWhen.in.includes(state[f.showWhen.key] ?? '');

type OnChange = (k: string, v: string) => void;

function NumberInput({ f, value, common, onChange }: { f: NumberField; value: string; common: Record<string, unknown>; onChange: OnChange }) {
  const input = <input {...common} type="number" inputMode="decimal" min={f.min} max={f.max} step={f.step} value={value} onChange={(e) => onChange(f.key, e.target.value)} />;
  if (f.display !== 'stepper') return input;
  const n = Number(value);
  return (
    <div className="stepper">
      <button type="button" aria-label={`Decrease ${f.label}`} disabled={Number.isFinite(n) && n <= f.min} onClick={() => onChange(f.key, stepValue(f, value, -1))}>
        −
      </button>
      {input}
      <button type="button" aria-label={`Increase ${f.label}`} disabled={Number.isFinite(n) && n >= f.max} onClick={() => onChange(f.key, stepValue(f, value, 1))}>
        +
      </button>
    </div>
  );
}

/** A small inline number input that belongs to another field's cell (e.g. "6 h a day" beside a quantity). */
function CompanionInput({ f, value, invalid, onChange }: { f: NumberField; value: string; invalid: boolean; onChange: OnChange }) {
  const id = useId();
  return (
    <div className="companion">
      <input
        id={id}
        name={f.key}
        className="mini"
        type="number"
        inputMode="decimal"
        min={f.min}
        max={f.max}
        step={f.step}
        value={value}
        aria-invalid={invalid || undefined}
        aria-label={f.label}
        onChange={(e) => onChange(f.key, e.target.value)}
      />
      <span aria-hidden="true">{f.suffix ?? ''}</span>
    </div>
  );
}

function FieldInput({
  f,
  value,
  invalid,
  onChange,
  companion,
}: {
  f: Field;
  value: string;
  invalid: boolean;
  onChange: OnChange;
  companion?: { f: NumberField; value: string; invalid: boolean };
}) {
  const id = useId();
  const hintId = f.hint ? `${id}-hint` : undefined;
  const common = { id, name: f.key, 'aria-invalid': invalid || undefined, 'aria-describedby': hintId } as const;
  const hint = f.hint ? (
    <p className="hint" id={hintId}>
      {f.hint}
    </p>
  ) : null;

  if (f.type === 'select' && f.display === 'tabs') {
    return (
      <div className="span2">
        <p className="label" id={`${id}-label`}>
          {f.label}
        </p>
        <div className="seg" role="radiogroup" aria-labelledby={`${id}-label`} aria-describedby={hintId}>
          {f.options.map((o) => (
            <label key={o.value} className={o.value === value ? 'on' : undefined}>
              <input type="radio" name={f.key} value={o.value} checked={o.value === value} onChange={() => onChange(f.key, o.value)} />
              {o.label}
            </label>
          ))}
        </div>
        {hint}
      </div>
    );
  }

  let control: React.ReactNode;
  switch (f.type) {
    case 'number':
      control = <NumberInput f={f} value={value} common={common} onChange={onChange} />;
      break;
    case 'select':
      control = (
        <select {...common} value={value} onChange={(e) => onChange(f.key, e.target.value)}>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case 'date':
      control = <input {...common} type="date" min={f.min} max={f.max} value={value} onChange={(e) => onChange(f.key, e.target.value)} />;
      break;
    case 'text':
      control = (
        <input {...common} type="text" inputMode="text" autoComplete="off" maxLength={f.maxLength} placeholder={f.placeholder} value={value} onChange={(e) => onChange(f.key, e.target.value)} />
      );
      break;
    case 'numberList':
      control = <textarea {...common} rows={3} value={value} onChange={(e) => onChange(f.key, e.target.value)} />;
      break;
  }
  const isStepper = f.type === 'number' && f.display === 'stepper';
  return (
    <div className={f.type === 'numberList' ? 'span2' : isStepper ? 'stepper-field' : undefined}>
      <label htmlFor={id}>{f.label}</label>
      {isStepper ? hint : null}
      {control}
      {companion ? <CompanionInput {...companion} onChange={onChange} /> : null}
      {isStepper ? null : hint}
    </div>
  );
}

/**
 * The one calculator island. `buildToday` is the build date so the static HTML and first client render match;
 * after hydration the visitor's local date and any shared-link values are applied. The URL is never written
 * while typing (SEC-CODE-09). Optional per spec: a step-by-step wizard (spec.steps), tabs, −/+ steppers, fields
 * shown only in one mode (showWhen) and group totals. The result panel stays visible on every step.
 */
export default function CalculatorEngine({
  spec,
  buildToday,
  initial,
}: {
  spec: CalculatorSpec;
  buildToday: string;
  /** Prefill (e.g. a programmatic instance). Validated through the same allow-list as query params. */
  initial?: Readonly<Record<string, string>>;
}) {
  const start = (day: string): RawState => (initial ? stateFromQuery(spec, new URLSearchParams(initial).toString(), day) : defaultState(spec, day));
  const [today, setToday] = useState(buildToday);
  const [state, setState] = useState<RawState>(() => start(buildToday));
  const [actionResult, setActionResult] = useState<ComputeResult | null>(null);
  const [copy, setCopy] = useState<{ status: 'idle' | 'ok' | 'fail'; url: string }>({ status: 'idle', url: '' });
  const [hydrated, setHydrated] = useState(false);
  // Bumped on every visitor change so the headline result replays a short CSS "pop" (never on first paint: LCP-safe).
  const [bump, setBump] = useState(0);
  // Once the visitor edits anything, the first-load sync must never overwrite it.
  const touched = useRef(false);
  // Wizard (spec.steps): the current step is UI state only; it's never put in the URL.
  const [step, setStep] = useState(0);
  const stepHeading = useRef<HTMLParagraphElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    const local = localTodayIso();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync with the browser's date and the shared link
    setToday(local);
    if (!touched.current) setState(window.location.search ? stateFromQuery(spec, window.location.search, local) : start(local));
    setHydrated(true);
    // `start` depends only on props that are stable for the page's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec]);

  // Move keyboard and screen-reader focus to the new step's heading (never on first render).
  useEffect(() => {
    if (moved.current) stepHeading.current?.focus();
  }, [step]);

  const { values, invalid } = useMemo(() => parseAll(spec, state, today), [spec, state, today]);
  const computed = useMemo(() => spec.compute(values, { today }), [spec, values, today]);
  const result = actionResult ?? computed;
  const primary = spec.outputs.find((o) => o.primary) ?? spec.outputs[0];
  const secondary = spec.outputs.filter((o) => o !== primary && !(o.hideWhenNull && result.values[o.key] == null));

  const onChange = (k: string, v: string) => {
    touched.current = true;
    setBump((b) => b + 1);
    setActionResult(null);
    setState((s) => applyChange(spec, s, k, v));
  };

  const groups = [...new Set(spec.fields.map((f) => f.group ?? ''))];
  const companions = new Map<string, NumberField>();
  for (const f of spec.fields) {
    if (f.type !== 'number' || !f.companion) continue;
    const c = spec.fields.find((x): x is NumberField => x.key === f.companion && x.type === 'number');
    if (c) companions.set(f.key, c);
  }
  const companionKeys = new Set([...companions.values()].map((c) => c.key));
  const steps = spec.steps?.length ? spec.steps : null;
  const stepIndex = steps ? Math.min(step, steps.length - 1) : 0;
  const current = steps ? steps[stepIndex] : undefined;
  const shownGroups = current ? groups.filter((g) => current.groups.includes(g)) : groups;
  const totalFor = (g: string): string | null => {
    const key = spec.groupTotals?.[g];
    const def = key ? spec.outputs.find((o) => o.key === key) : undefined;
    return def ? formatOutput(def, result.values[def.key]) : null;
  };

  const goTo = (i: number) => {
    moved.current = true;
    setStep(i);
  };
  const showResults = () => {
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    resultRef.current?.focus({ preventScroll: true });
  };

  const downloadCsv = () => {
    const csv = toCsv([
      ['Field', 'Value'],
      ...spec.fields.map((f) => [f.label, state[f.key] ?? '']),
      ...spec.outputs.map((o) => [o.label, formatOutput(o, result.values[o.key])]),
    ]);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.csvName ?? spec.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?${queryFromState(spec, state)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopy({ status: 'ok', url });
    } catch {
      setCopy({ status: 'fail', url });
    }
  };

  return (
    <div className="tool" data-hydrated={hydrated ? 'true' : undefined}>
      <form className="card" aria-label="Calculator inputs" onSubmit={(e) => e.preventDefault()} noValidate data-step={steps ? stepIndex + 1 : undefined}>
        {steps && current ? (
          <>
            <ol className="wizard-nav" aria-label="Calculator steps">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    className={i === stepIndex ? 'on' : i < stepIndex ? 'done' : undefined}
                    aria-current={i === stepIndex ? 'step' : undefined}
                    onClick={() => goTo(i)}
                  >
                    <span className="n" aria-hidden="true">
                      {i < stepIndex ? '✓' : i + 1}
                    </span>
                    <span className="t">{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="wizard-title" ref={stepHeading} tabIndex={-1}>
              <span>
                Step {stepIndex + 1} of {steps.length}
              </span>
              {current.title}
            </p>
            {current.intro ? <p className="hint wizard-intro">{current.intro}</p> : null}
          </>
        ) : null}
        {shownGroups.map((g) => {
          const fields = spec.fields.filter((f) => (f.group ?? '') === g && !companionKeys.has(f.key) && isShown(f, state));
          if (!fields.length) return null;
          const total = totalFor(g);
          const allSteppers = fields.every((f) => f.type === 'number' && f.display === 'stepper');
          return (
            <fieldset key={g || 'main'}>
              {g ? (
                <legend>
                  {g}
                  {total ? <span className="group-total">Total: {total}</span> : null}
                </legend>
              ) : null}
              <div className={allSteppers ? 'grid2 stepper-grid' : 'grid2'}>
                {fields.map((f) => {
                  const c = companions.get(f.key);
                  return (
                    <FieldInput
                      key={f.key}
                      f={f}
                      value={state[f.key] ?? ''}
                      invalid={invalid.includes(f.key)}
                      onChange={onChange}
                      companion={c ? { f: c, value: state[c.key] ?? '', invalid: invalid.includes(c.key) } : undefined}
                    />
                  );
                })}
              </div>
            </fieldset>
          );
        })}
        {spec.action ? (
          <div className="btns">
            <button type="button" className="primary" onClick={() => {
                setBump((b) => b + 1);
                setActionResult(spec.action!.run(values, { today }));
              }}>
              {spec.action.label}
            </button>
          </div>
        ) : null}
        {steps ? (
          <div className="btns wizard-actions">
            {stepIndex > 0 ? (
              <button type="button" onClick={() => goTo(stepIndex - 1)}>
                Back
              </button>
            ) : null}
            {stepIndex < steps.length - 1 ? (
              <button type="button" className="primary" onClick={() => goTo(stepIndex + 1)}>
                Next: {steps[stepIndex + 1]!.title}
              </button>
            ) : (
              <button type="button" className="primary" onClick={showResults}>
                See your results
              </button>
            )}
          </div>
        ) : null}
      </form>

      <section className="card result" aria-label="Result" aria-live="polite" ref={resultRef} tabIndex={-1}>
        {primary ? (
          <>
            <p className="result-label">{primary.label}</p>
            <p key={bump} className={bump ? 'price pop' : 'price'} data-testid="primary-result">
              {formatOutput(primary, result.values[primary.key])}
            </p>
          </>
        ) : null}
        {invalid.length > 0 ? (
          <p className="warn" data-testid="input-warning">
            Check your inputs: {spec.fields.filter((f) => invalid.includes(f.key)).map((f) => f.label).join(', ')}. Values outside the allowed
            range were adjusted.
          </p>
        ) : null}
        {result.warnings?.map((w) => (
          <p className="warn" key={w}>
            {w}
          </p>
        ))}
        {secondary.length ? (
          <table>
            <tbody>
              {secondary.map((o) => (
                <tr key={o.key}>
                  <td>{o.label}</td>
                  <td>{formatOutput(o, result.values[o.key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {result.steps?.length ? (
          <details className="steps" open>
            <summary>Show the working</summary>
            <ol>
              {result.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </details>
        ) : null}
        <div className="btns">
          <button type="button" onClick={downloadCsv}>
            Download CSV
          </button>
          <button type="button" onClick={copyLink}>
            Copy link with these numbers
          </button>
        </div>
        {copy.status === 'ok' ? <p className="hint">Link copied.</p> : null}
        {copy.status === 'fail' ? (
          <label className="hint">
            Copy this link:
            <input readOnly value={copy.url} onFocus={(e) => e.currentTarget.select()} />
          </label>
        ) : null}
        <p className="hint">Nothing you type leaves your browser.</p>
      </section>
    </div>
  );
}

'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CalculatorSpec, ComputeResult, Field } from '@/lib/engine/spec';
import { applyChange, defaultState, parseAll, queryFromState, stateFromQuery, type RawState } from '@/lib/engine/parse';
import { formatOutput, localTodayIso } from '@/lib/engine/format';
import { toCsv } from '@/lib/csv';

function FieldInput({ f, value, invalid, onChange }: { f: Field; value: string; invalid: boolean; onChange: (k: string, v: string) => void }) {
  const id = useId();
  const hintId = f.hint ? `${id}-hint` : undefined;
  const common = { id, name: f.key, 'aria-invalid': invalid || undefined, 'aria-describedby': hintId } as const;
  let control: React.ReactNode;
  switch (f.type) {
    case 'number':
      control = (
        <input {...common} type="number" inputMode="decimal" min={f.min} max={f.max} step={f.step} value={value} onChange={(e) => onChange(f.key, e.target.value)} />
      );
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
  return (
    <div className={f.type === 'numberList' ? 'span2' : undefined}>
      <label htmlFor={id}>{f.label}</label>
      {control}
      {f.hint ? (
        <p className="hint" id={hintId}>
          {f.hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The one calculator island. `buildToday` is the build date so the static HTML and first client render match;
 * after hydration the visitor's local date and any shared-link values are applied. The URL is never written
 * while typing (SEC-CODE-09).
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

  useEffect(() => {
    const local = localTodayIso();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync with the browser's date and the shared link
    setToday(local);
    if (!touched.current) setState(window.location.search ? stateFromQuery(spec, window.location.search, local) : start(local));
    setHydrated(true);
    // `start` depends only on props that are stable for the page's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec]);

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
      <form className="card" aria-label="Calculator inputs" onSubmit={(e) => e.preventDefault()} noValidate>
        {groups.map((g) => (
          <fieldset key={g || 'main'}>
            {g ? <legend>{g}</legend> : null}
            <div className="grid2">
              {spec.fields
                .filter((f) => (f.group ?? '') === g)
                .map((f) => (
                  <FieldInput key={f.key} f={f} value={state[f.key] ?? ''} invalid={invalid.includes(f.key)} onChange={onChange} />
                ))}
            </div>
          </fieldset>
        ))}
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
      </form>

      <section className="card result" aria-label="Result" aria-live="polite">
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

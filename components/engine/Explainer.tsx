import DataTable from '@/components/DataTable';
import Formula from '@/components/Formula';
import { ASSUMPTIONS_HEADING, FORMULA_HEADING, type Explain } from '@/lib/engine/explain';
import { anchorId } from '@/lib/format';

/**
 * Formula, worked example, extra sections, original data tables and limits, rendered at build (server).
 * Every block is its own <section> with an H2 and a fragment id, matching explainHeadings() for "On this page".
 */
export default function Explainer({ explain }: { explain: Explain }) {
  return (
    <>
      <section aria-labelledby="formula">
        <h2 id="formula">{FORMULA_HEADING}</h2>
        <Formula lines={explain.formula} />
        {explain.example ? <p>{explain.example}</p> : null}
      </section>

      {explain.sections?.map((s) => (
        <section key={s.heading} aria-labelledby={anchorId(s.heading)}>
          <h2 id={anchorId(s.heading)}>{s.heading}</h2>
          {s.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </section>
      ))}

      {explain.tables?.map((t) => (
        <section key={t.caption} aria-labelledby={anchorId(t.caption)}>
          <h2 id={anchorId(t.caption)}>{t.caption}</h2>
          <DataTable labelledBy={anchorId(t.caption)} columns={t.columns} rows={t.rows} />
          {t.note ? <p className="table-note">{t.note}</p> : null}
        </section>
      ))}

      {explain.assumptions?.length ? (
        <section aria-labelledby="assumptions">
          <h2 id="assumptions">{ASSUMPTIONS_HEADING}</h2>
          <ul>
            {explain.assumptions.map((a) => (
              <li key={a.slice(0, 40)}>{a}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

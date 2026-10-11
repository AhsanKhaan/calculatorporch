import { numericColumns } from '@/lib/format';

/** An original data table (explainers and instance pages): labelled by its H2, numeric columns right-aligned, scrolls inside its frame on phones. */
export default function DataTable({ labelledBy, columns, rows }: { labelledBy: string; columns: readonly string[]; rows: readonly (readonly (string | number)[])[] }) {
  const num = numericColumns(rows);
  return (
    <div className="table-wrap">
      <table className="data" aria-labelledby={labelledBy}>
        <thead>
          <tr>
            {columns.map((c, j) => (
              <th scope="col" key={c} className={num[j] ? 'num' : undefined}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} className={num[j] ? 'num' : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

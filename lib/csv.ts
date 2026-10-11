/**
 * CSV building with formula-injection protection (SEC-CODE-23): a cell that starts with = + - @ (or a tab/CR)
 * and isn't a plain number is prefixed with an apostrophe, so Excel and Sheets treat it as text.
 */
const PLAIN_NUMBER = /^-?\d+(?:\.\d+)?$/;
const FORMULA_START = /^[=+\-@\t\r]/;

export function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  if (FORMULA_START.test(s) && !PLAIN_NUMBER.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function toCsv(rows: ReadonlyArray<ReadonlyArray<unknown>>): string {
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
}

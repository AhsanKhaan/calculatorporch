/** Formula block: one equation per line; a long line wraps with a hanging indent instead of scrolling the page on phones. */
export default function Formula({ lines }: { lines: readonly string[] }) {
  return (
    <pre className="formula">
      {lines.map((line) => (
        <code key={line}>{line}</code>
      ))}
    </pre>
  );
}

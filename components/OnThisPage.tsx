/** "On this page": jump links to every H2 of a long page, in order (docs/05 §1a). */
export default function OnThisPage({ items }: { items: readonly { id: string; heading: string }[] }) {
  if (items.length < 3) return null;
  return (
    <nav className="toc" aria-labelledby="toc-title">
      <p className="toc-title" id="toc-title">
        On this page
      </p>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`}>{i.heading}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import Link from 'next/link';

/** A list of calculator links with one-line descriptions (category pages, related blocks, A–Z). */
export default function ToolList({ tools, compact = false }: { tools: readonly { url: string; name: string; description: string }[]; compact?: boolean }) {
  return (
    <ul className={compact ? 'link-list' : 'tool-list'}>
      {tools.map((t) => (
        <li key={t.url}>
          <Link href={t.url}>{t.name}</Link>
          {compact ? null : <span className="muted">{t.description}</span>}
        </li>
      ))}
    </ul>
  );
}

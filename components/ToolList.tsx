import Link from 'next/link';
import Icon, { categoryIcon } from '@/components/Icon';

/**
 * Calculator links. `compact` = chips (related blocks, A–Z); otherwise cards with the category icon and a one-line
 * description, where the whole card is the link target. `reveal` adds the scroll-in motion (transform only).
 */
export default function ToolList({
  tools,
  compact = false,
  reveal = false,
}: {
  tools: readonly { url: string; name: string; description: string }[];
  compact?: boolean;
  reveal?: boolean;
}) {
  if (compact) {
    return (
      <ul className="link-list">
        {tools.map((t) => (
          <li key={t.url}>
            <Link href={t.url}>{t.name}</Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={reveal ? 'tool-list reveal' : 'tool-list'}>
      {tools.map((t) => (
        <li key={t.url}>
          <span className="icon-tile">
            <Icon name={categoryIcon(t.url.split('/')[1] ?? '')} />
          </span>
          <Link href={t.url}>{t.name}</Link>
          <span className="muted">{t.description}</span>
        </li>
      ))}
    </ul>
  );
}

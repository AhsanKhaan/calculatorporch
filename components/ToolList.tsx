import Link from 'next/link';
import Icon, { categoryIcon } from '@/components/Icon';

/**
 * Card text from the meta description. Descriptions lead with the keyword for search snippets ("Day counter: count
 * the days…"); under a card titled "Day Counter" that reads twice, so the "… <tool name> …:" lead-in is dropped.
 */
export function cardBlurb(name: string, description: string): string {
  const colon = description.indexOf(': ');
  if (colon < 0 || !description.slice(0, colon).toLowerCase().includes(name.toLowerCase())) return description;
  const rest = description.slice(colon + 2);
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

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
          <span className="muted">{cardBlurb(t.name, t.description)}</span>
        </li>
      ))}
    </ul>
  );
}

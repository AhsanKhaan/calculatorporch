import Link from 'next/link';
import { SITE } from '@/content/site';
import { shortDate } from '@/lib/engine/format';

/** Byline under the H1: the real author and the last-reviewed date, visible before the tool (docs/05 §4). */
export default function Byline({ updated }: { updated: string }) {
  return (
    <p className="byline">
      By <Link href={SITE.author.path}>{SITE.author.name}</Link> · Last reviewed <time dateTime={updated}>{shortDate(updated)}</time> ·{' '}
      <Link href="/methodology/">How we check our numbers</Link>
    </p>
  );
}

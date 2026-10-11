import Link from 'next/link';
import { SITE } from '@/content/site';
import type { Tool } from '@/content/schema';
import { shortDate } from '@/lib/engine/format';

/** Author, sources, review date, error reports and disclaimer (docs/05 §1 item 12). */
export default function TrustFooter({ tool }: { tool: Tool }) {
  const subject = encodeURIComponent(`Error report: ${tool.name}`);
  return (
    <section aria-labelledby="about-tool" className="trust">
      <h2 id="about-tool">About this calculator</h2>
      <div className="author">
        <span className="monogram" aria-hidden="true">
          {SITE.author.name
            .split(' ')
            .map((w) => w[0])
            .join('')}
        </span>
        <p>
          <Link href={SITE.author.path} className="name">
            {SITE.author.name}
          </Link>
          <br />
          <span className="muted">
            Last reviewed <time dateTime={tool.updated}>{shortDate(tool.updated)}</time>
          </span>
        </p>
      </div>
      <p>
        Written and maintained by {SITE.author.name}. See how every number is calculated, and the test cases checked on every
        update, on the <Link href="/methodology/">methodology page</Link>.
      </p>
      {/* No empty "Sources" heading: the release gate (check:release) requires ≥ 2 before a tool can publish. */}
      {tool.sources.length ? (
        <>
          <h3>Sources</h3>
          <ul>
            {tool.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="noopener noreferrer">
                  {s.title}
                </a>
                , {s.publisher} (accessed {shortDate(s.accessed)})
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <p>
        Found an error? <a href={`mailto:${SITE.contactEmail}?subject=${subject}`}>Email a correction</a> and include the
        link from &ldquo;Copy link&rdquo; so we can reproduce it.
      </p>
      {tool.disclaimer ? <p className="muted">{tool.disclaimer}</p> : null}
    </section>
  );
}

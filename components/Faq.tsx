import Icon from '@/components/Icon';
import type { Faq as FaqItem } from '@/content/schema';

/**
 * FAQ accordion built on native <details>/<summary>: keyboard (Enter/Space), focus and the expanded state are
 * exposed by the browser, with no JavaScript. Each question stays an H3 (allowed inside <summary>) so the page
 * outline and passage structure are unchanged (docs/05 §5). Answers are always in the HTML (closed <details>
 * content is still indexed and found by find-in-page). The first item starts open.
 * The same strings feed the FAQPage JSON-LD (lib/seo/jsonld.ts), so the markup and schema always match.
 */
export default function Faq({ faqs, heading = 'Frequently asked questions', id = 'faq' }: { faqs: readonly FaqItem[]; heading?: string; id?: string }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{heading}</h2>
      <div className="faq">
        {faqs.map((f, n) => (
          <details className="faq-item" key={f.q} open={n === 0}>
            <summary>
              <h3>{f.q}</h3>
              <span className="faq-toggle" aria-hidden="true">
                <Icon name="plus" size={16} />
              </span>
            </summary>
            <div className="faq-a">
              <p>{f.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

import type { Faq as FaqItem } from '@/content/schema';

/**
 * Visible FAQ: each question is an H3 with its answer always shown, so every Q&A is a self-contained passage that
 * readers, Google and AI answers can quote (docs/05 §5). The same strings feed FAQPage JSON-LD, so the text always matches.
 */
export default function Faq({ faqs, heading = 'Frequently asked questions', id = 'faq' }: { faqs: readonly FaqItem[]; heading?: string; id?: string }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{heading}</h2>
      {faqs.map((f) => (
        <div className="faq-item" key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </section>
  );
}

/**
 * The 40–60 word direct answer (docs/05 §1 item 3), server-rendered at full contrast right under the H1. This is the
 * passage AI answers and featured snippets quote, so it must never be styled as secondary text.
 */
export default function QuickAnswer({ text }: { text: string }) {
  return (
    <div className="answer-box">
      <p className="answer-label">Quick answer</p>
      <p data-testid="direct-answer">{text}</p>
    </div>
  );
}

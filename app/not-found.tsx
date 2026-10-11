import Link from 'next/link';
import { categoryPath, publishedCategories } from '@/content/registry';

export default function NotFound() {
  return (
    <section className="prose">
      <h1>Page not found</h1>
      <p>That page doesn&apos;t exist, or it has moved. Try one of these:</p>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/calculators/">All calculators A–Z</Link>
        </li>
        {publishedCategories.map((c) => (
          <li key={c.slug}>
            <Link href={categoryPath(c)}>{c.name} calculators</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

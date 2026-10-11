import Link from 'next/link';
import { SITE } from '@/content/site';
import { categoryPath, publishedCategories } from '@/content/registry';

export default function SiteHeader() {
  return (
    <header className="site">
      <div className="wrap">
        <Link href="/" className="brand">
          {SITE.name}
        </Link>
        <nav aria-label="Categories">
          {publishedCategories.map((c) => (
            <Link key={c.slug} href={categoryPath(c)}>
              {c.name}
            </Link>
          ))}
          <Link href="/calculators/">All calculators</Link>
        </nav>
      </div>
    </header>
  );
}

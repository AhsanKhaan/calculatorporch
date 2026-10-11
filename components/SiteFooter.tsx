import Link from 'next/link';
import { SITE } from '@/content/site';
import { AUTHOR, TRUST_PAGES, categoryPath, publishedCategories } from '@/content/registry';

export default function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <nav aria-label="Calculator categories">
          {publishedCategories.map((c) => (
            <Link key={c.slug} href={categoryPath(c)}>
              {c.name}
            </Link>
          ))}
          <Link href="/calculators/">All calculators A–Z</Link>
        </nav>
        <nav aria-label="Site">
          {TRUST_PAGES.map((p) => (
            <Link key={p.path} href={p.path}>
              {p.name}
            </Link>
          ))}
          <Link href={AUTHOR.path}>Author</Link>
          <a href="/llms.txt">llms.txt</a>
        </nav>
        <p>
          © {SITE.foundingYear} {SITE.name}. Estimates only, not professional, financial, legal or veterinary advice.
        </p>
      </div>
    </footer>
  );
}

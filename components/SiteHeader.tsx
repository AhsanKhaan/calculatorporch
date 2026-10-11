import Link from 'next/link';
import Icon from '@/components/Icon';
import { SITE } from '@/content/site';
import { categoryPath, publishedCategories } from '@/content/registry';

/** Translucent header: logo mark + category nav (sticky on desktop, one swipeable row on phones). Server-rendered. */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="logo">
          <span className="logo-mark">
            <Icon name="calculator" size={18} />
          </span>
          {SITE.name}
        </Link>
        <nav aria-label="Categories" className="nav">
          {publishedCategories.map((c) => (
            <Link key={c.slug} href={categoryPath(c)}>
              {c.name}
            </Link>
          ))}
          <Link href="/calculators/" className="nav-all">
            All calculators
          </Link>
        </nav>
      </div>
    </header>
  );
}

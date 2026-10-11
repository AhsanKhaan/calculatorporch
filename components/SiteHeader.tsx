import Link from 'next/link';
import Icon from '@/components/Icon';
import NavLinks from '@/components/NavLinks';
import { SITE } from '@/content/site';
import { categoryPath, publishedCategories } from '@/content/registry';

/** Header: logo mark + category nav with the active page marked (sticky on desktop, one swipeable row on phones). */
export default function SiteHeader() {
  const links = [
    ...publishedCategories.map((c) => ({ href: categoryPath(c), label: c.name })),
    { href: '/calculators/', label: 'All calculators', className: 'nav-all' },
  ];
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="logo">
          <span className="logo-mark">
            <Icon name="calculator" size={18} />
          </span>
          {SITE.name}
        </Link>
        <NavLinks links={links} />
      </div>
    </header>
  );
}

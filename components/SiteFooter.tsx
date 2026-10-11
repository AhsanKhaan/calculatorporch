import Link from 'next/link';
import Icon from '@/components/Icon';
import { SITE } from '@/content/site';
import { AUTHOR, TRUST_PAGES, categoryPath, publishedCategories } from '@/content/registry';

/** Column footer: brand, categories, site pages, resources. Titles are <p>, not headings, so page outlines stay clean. */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <span className="logo-mark">
                <Icon name="calculator" size={18} />
              </span>
              {SITE.name}
            </Link>
            <p>Free calculators that show their formula, a worked example and the sources behind every number.</p>
          </div>
          <nav aria-label="Calculator categories">
            <p className="footer-title">Categories</p>
            <ul>
              {publishedCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={categoryPath(c)}>{c.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/calculators/">All calculators A–Z</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Site">
            <p className="footer-title">Site</p>
            <ul>
              {TRUST_PAGES.map((p) => (
                <li key={p.path}>
                  <Link href={p.path}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Resources">
            <p className="footer-title">Resources</p>
            <ul>
              <li>
                <Link href={AUTHOR.path}>Author</Link>
              </li>
              <li>
                <a href="/llms.txt">llms.txt</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>
            © {SITE.foundingYear} {SITE.name}
          </span>
          <span>Estimates only, not professional, financial, legal or veterinary advice.</span>
        </div>
      </div>
    </footer>
  );
}

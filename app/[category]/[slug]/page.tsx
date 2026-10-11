import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import Breadcrumbs from '@/components/Breadcrumbs';
import Byline from '@/components/Byline';
import Explainer from '@/components/engine/Explainer';
import Faq from '@/components/Faq';
import Icon, { categoryIcon } from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import OnThisPage from '@/components/OnThisPage';
import QuickAnswer from '@/components/QuickAnswer';
import ToolList from '@/components/ToolList';
import TrustFooter from '@/components/TrustFooter';
import { ISLANDS } from '@/components/calculators';
import { EXPLAINS } from '@/lib/calculators/explains';
import { BUILD_TODAY, publishedTool, publishedTools } from '@/content/registry';
import { explainHeadings } from '@/lib/engine/explain';
import { anchorId } from '@/lib/format';
import { crumbsForTool, instancesOf, moreTools, related, siblings } from '@/lib/links';
import { toolGraph } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedTools.filter((t) => ISLANDS[t.calculator]).map((t) => ({ category: t.category.slug, slug: t.url.split('/')[2]! }));
}

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const t = publishedTool(`/${category}/${slug}/`);
  return t ? pageMetadata({ title: t.title, description: t.description, path: t.url }) : {};
}

/**
 * Calculator page, in the order of docs/05 §1, with the link blocks of docs/10 §4.
 * Heading structure (docs/05 §1a): one H1, then one H2 per block, each with a fragment id listed in "On this page";
 * FAQ questions are H3s. The tool name appears in one H2 ("How to use the …"), not in every heading: no stuffing.
 */
export default async function CalculatorPage({ params }: Props) {
  const { category, slug } = await params;
  const tool = publishedTool(`/${category}/${slug}/`);
  const Island = tool ? ISLANDS[tool.calculator] : undefined;
  if (!tool || !Island) notFound();
  const explain = EXPLAINS[tool.calculator]?.();
  const crumbs = crumbsForTool(tool);
  const sib = siblings(tool);
  const rel = related(tool);
  const more = moreTools(tool, [...sib, ...rel]);
  const instances = instancesOf(tool);

  const h = {
    answers: 'Worked answers',
    use: `How to use the ${tool.name}`,
    means: 'What your result means',
    faq: 'Frequently asked questions',
    similar: `Similar ${tool.subcategory.toLowerCase()} calculators`,
    related: 'Related calculators',
    more: 'More free calculators',
    about: 'About this calculator',
  };
  const outline = [
    ...(instances.length ? [{ id: 'popular-answers', heading: h.answers }] : []),
    { id: 'what-it-means', heading: h.means },
    { id: 'how-to-use', heading: 'How to use it' },
    ...(explain ? explainHeadings(explain, anchorId) : []),
    { id: 'faq', heading: h.faq },
    ...(sib.length ? [{ id: 'similar', heading: h.similar }] : []),
    ...(rel.length ? [{ id: 'related', heading: h.related }] : []),
    ...(more.length ? [{ id: 'more', heading: h.more }] : []),
    { id: 'about-tool', heading: h.about },
  ];

  return (
    <>
      <JsonLd data={toolGraph(tool, tool.url, crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <div className="title-row">
        <span className="icon-tile">
          <Icon name={categoryIcon(tool.category.slug)} />
        </span>
        <h1>{tool.h1}</h1>
      </div>
      <Byline updated={tool.updated} />
      <QuickAnswer text={tool.directAnswer} />

      <Island buildToday={BUILD_TODAY} />

      {/* Ads: after the whole calculator (never between inputs and result), mid-content, and the desktop rail. */}
      <AdSlot id="tool-below-calculator" />

      <div className="page-grid">
        <div className="rail">
          <div className="rail-inner">
            <OnThisPage items={outline} />
            <AdSlot id="tool-rail" variant="rail" />
          </div>
        </div>
      <div className="content">
        {instances.length ? (
          <section aria-labelledby="popular-answers">
            <h2 id="popular-answers">{h.answers}</h2>
            <ul className="link-list">
              {instances.map((i) => (
                <li key={i.url}>
                  <Link href={i.url}>{i.name}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="what-it-means">
          <h2 id="what-it-means">{h.means}</h2>
          <p>{tool.whatItMeans}</p>
        </section>

        <section aria-labelledby="how-to-use">
          <h2 id="how-to-use">{h.use}</h2>
          <ol>
            {tool.howToUse.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        {explain ? <Explainer explain={explain} /> : null}

        <AdSlot id="tool-mid-content" />

        <Faq faqs={tool.faqs} />

        {sib.length ? (
          <section aria-labelledby="similar">
            <h2 id="similar">{h.similar}</h2>
            <ToolList tools={sib} compact />
          </section>
        ) : null}
        {rel.length ? (
          <section aria-labelledby="related">
            <h2 id="related">{h.related}</h2>
            <ToolList tools={rel} compact />
          </section>
        ) : null}
        {more.length ? (
          <section aria-labelledby="more">
            <h2 id="more">{h.more}</h2>
            <ToolList tools={more} compact />
          </section>
        ) : null}

        <TrustFooter tool={tool} />
      </div>
      </div>
    </>
  );
}

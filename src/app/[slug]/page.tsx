import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchWPPageBySlug, fetchSeoMeta } from '../../../lib/wordpress-blog';
import { fetchProducts, fetchProductsByCategory, resolveCategoryBySlug, Product } from '../../../lib/woocommerceApi';
import WordPressPageContent from './WordPressPageContent';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [page, seo] = await Promise.all([
    fetchWPPageBySlug(slug),
    fetchSeoMeta(slug),
  ]);
  if (!page) return {};

  const plainTitle = page.title.replace(/<[^>]+>/g, '');
  const seoTitle = seo?.title || plainTitle;
  const seoDesc = seo?.description || page.excerpt.slice(0, 160);
  const seoImage = seo?.ogImage || page.image;

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: { canonical: `https://www.edaperfumes.com/${slug}` },
    openGraph: {
      title: seo?.ogTitle || seoTitle,
      description: seo?.ogDescription || seoDesc,
      type: 'website',
      url: `https://www.edaperfumes.com/${slug}`,
      siteName: 'EDA Perfumes',
      ...(seoImage ? { images: [{ url: seoImage }] } : {}),
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://www.edaperfumes.com'),
  };
}

// Decode HTML entities WordPress may add (&#91; &#93; &#8220; &#8221; &quot; etc.)
function decodeWPContent(html: string): string {
  return html
    .replace(/&#91;/g, '[').replace(/&#93;/g, ']')
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'").replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/\u201c/g, '"').replace(/\u201d/g, '"')
    .replace(/\u2018/g, "'").replace(/\u2019/g, "'");
}

function parseProductsShortcode(content: string): { category?: string; limit?: number } | null {
  const decoded = decodeWPContent(content);
  const match = decoded.match(/\[eda_products([^\]]*)\]/i);
  if (!match) return null;
  const attrs = match[1] || '';
  const catMatch = attrs.match(/category=["']([^"']*)["']/i);
  const limitMatch = attrs.match(/limit=["']?(\d+)["']?/i);
  return {
    category: catMatch?.[1] || undefined,
    limit: limitMatch ? parseInt(limitMatch[1], 10) : undefined,
  };
}

export default async function WordPressPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchWPPageBySlug(slug);

  if (!page) {
    notFound();
  }

  // Only fetch products if [products] shortcode exists in content
  let products: Product[] = [];
  const shortcode = parseProductsShortcode(page.content);

  if (shortcode) {
    try {
      const perPage = shortcode.limit || 100;
      if (shortcode.category) {
        const cat = await resolveCategoryBySlug(shortcode.category);
        if (cat) {
          products = await fetchProductsByCategory(cat.id, 1, perPage);
        }
      } else {
        products = await fetchProducts(1, perPage);
      }
    } catch {}
  }

  return <WordPressPageContent page={page} products={products} />;
}

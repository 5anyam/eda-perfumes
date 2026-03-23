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

// Decode all HTML entities WordPress adds via wptexturize
function decodeWPContent(html: string): string {
  return html.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

function parseProductsShortcode(content: string): { category?: string; limit?: number } | null {
  const decoded = decodeWPContent(content);
  const match = decoded.match(/\[eda_products([^\]]*)\]/i);
  if (!match) return null;
  const attrs = match[1] || '';
  // Match any quote type (straight, curly, prime) or no quotes
  const catMatch = attrs.match(/category\s*=\s*\W?(\w[\w-]*)\W?/i);
  const limitMatch = attrs.match(/limit\s*=\s*\W?(\d+)/i);
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

  // Strip shortcode from content on server side before passing to client
  const cleanedContent = decodeWPContent(page.content)
    .replace(/\[eda_products[^\]]*\]/gi, '')
    .trim();

  return <WordPressPageContent page={{ ...page, content: cleanedContent }} products={products} />;
}

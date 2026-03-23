import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchWPPageBySlug, fetchSeoMeta } from '../../../lib/wordpress-blog';
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

export default async function WordPressPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchWPPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <WordPressPageContent page={page} />;
}

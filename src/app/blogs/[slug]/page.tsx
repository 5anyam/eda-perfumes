import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBlogPostBySlug, fetchSeoMeta } from '../../../../lib/wordpress-blog';
import WordPressBlogArticle from './WordPressBlogArticle';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, seo] = await Promise.all([
    fetchBlogPostBySlug(slug),
    fetchSeoMeta(slug),
  ]);
  if (!post) return {};

  const plainTitle = post.title.replace(/<[^>]+>/g, '');
  const seoTitle = seo?.title || plainTitle;
  const seoDesc = seo?.description || post.excerpt.slice(0, 160);
  const seoImage = seo?.ogImage || post.image;

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: { canonical: `https://www.edaperfumes.com/blogs/${slug}` },
    openGraph: {
      title: seo?.ogTitle || seoTitle,
      description: seo?.ogDescription || seoDesc,
      type: 'article',
      url: `https://www.edaperfumes.com/blogs/${slug}`,
      siteName: 'EDA Perfumes',
      ...(seoImage ? { images: [{ url: seoImage }] } : {}),
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://www.edaperfumes.com'),
  };
}

export default async function WordPressBlogPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <WordPressBlogArticle post={post} />;
}

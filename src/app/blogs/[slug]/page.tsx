import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBlogPostBySlug } from '../../../../lib/wordpress-blog';
import WordPressBlogArticle from './WordPressBlogArticle';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);
  if (!post) return {};

  const plainTitle = post.title.replace(/<[^>]+>/g, '');

  return {
    title: plainTitle,
    description: post.excerpt.slice(0, 160),
    alternates: { canonical: `https://www.edaperfumes.com/blogs/${slug}` },
    openGraph: {
      title: plainTitle,
      description: post.excerpt.slice(0, 160),
      type: 'article',
      url: `https://www.edaperfumes.com/blogs/${slug}`,
      siteName: 'EDA Perfumes',
      ...(post.image ? { images: [{ url: post.image }] } : {}),
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

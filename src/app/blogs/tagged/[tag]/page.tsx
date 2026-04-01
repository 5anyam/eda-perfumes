import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogListClient from '../../BlogListClient';
import { fetchBlogPosts } from '../../../../../lib/wordpress-blog';

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const title = tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${title} - Blog | EDA Perfumes`,
    description: `Read articles about ${title.toLowerCase()} on EDA Perfumes blog.`,
    alternates: { canonical: `https://www.edaperfumes.com/blogs/tagged/${tag}` },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://www.edaperfumes.com'),
  };
}

export default async function TaggedBlogPage({ params }: Props) {
  const { tag } = await params;
  const wpPosts = await fetchBlogPosts();

  const formattedPosts = wpPosts.map((post) => ({
    title: post.title.replace(/<[^>]+>/g, ''),
    slug: post.slug,
    excerpt: post.excerpt,
    image: post.image,
    date: new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
    tags: post.tags,
  }));

  return (
    <Suspense>
      <BlogListClient wpPosts={formattedPosts.length > 0 ? formattedPosts : undefined} activeTagSlug={tag} />
    </Suspense>
  );
}

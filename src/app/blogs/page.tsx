import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogListClient from './BlogListClient';
import { fetchBlogPosts } from '../../../lib/wordpress-blog';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog | EDA Perfumes - Fragrance Tips & Guides',
  description: 'Explore expert fragrance tips, perfume guides, and the art of wearing luxury scents with confidence. Discover the world of EDA Perfumes.',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs' },
  openGraph: {
    title: 'Blog | EDA Perfumes',
    description: 'Explore expert fragrance tips, perfume guides, and the art of wearing luxury scents with confidence.',
    type: 'website',
    url: 'https://www.edaperfumes.com/blogs',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default async function BlogPage() {
  const wpPosts = await fetchBlogPosts();

  // Format WP posts for the client component
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
      <BlogListClient wpPosts={formattedPosts.length > 0 ? formattedPosts : undefined} />
    </Suspense>
  );
}

import type { Metadata } from 'next';
import BlogListClient from './BlogListClient';
import { fetchBlogPosts, fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('blogs');
  const title = yoast?.title || 'Blog | EDA Perfumes - Fragrance Tips & Guides';
  const description = yoast?.description || 'Explore expert fragrance tips, perfume guides, and the art of wearing luxury scents with confidence. Discover the world of EDA Perfumes.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/blogs';
  return {
    title, description,
    alternates: { canonical },
    openGraph: {
      title: yoast?.og_title || title, description: yoast?.og_description || description,
      type: 'website', url: canonical,
      siteName: yoast?.og_site_name || 'EDA Perfumes',
      ...(yoast?.og_image?.[0]?.url && { images: [{ url: yoast.og_image[0].url }] }),
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://www.edaperfumes.com'),
  };
}

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

  return (<><PageSchemas slug="blogs" />
    <BlogListClient wpPosts={formattedPosts.length > 0 ? formattedPosts : undefined} />
  </>);
}

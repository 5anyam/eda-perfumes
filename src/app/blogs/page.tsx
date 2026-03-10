import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogListClient from './BlogListClient';

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

export default function BlogPage() {
  return (
    <Suspense>
      <BlogListClient />
    </Suspense>
  );
}

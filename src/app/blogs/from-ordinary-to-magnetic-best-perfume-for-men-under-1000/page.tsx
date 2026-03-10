import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'From Ordinary to Magnetic: Best Perfume for Men Under 1000',
  description: 'Transform your vibe & Explore the best perfume for men under 1000 in India—floral, citrus, and vanilla fragrances that elevate confidence, leave lasting impressions.',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/from-ordinary-to-magnetic-best-perfume-for-men-under-1000' },
  keywords: ['Best Perfume For Men Under 1000', 'Floral Citrus Vanilla Perfume', 'Luxury Perfume Gift Set', 'Perfume For Men Combo'],
  openGraph: {
    title: 'From Ordinary to Magnetic: Best Perfume for Men Under 1000',
    description: 'Transform your vibe & Explore the best perfume for men under 1000 in India—floral, citrus, and vanilla fragrances that elevate confidence, leave lasting impressions.',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/from-ordinary-to-magnetic-best-perfume-for-men-under-1000',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

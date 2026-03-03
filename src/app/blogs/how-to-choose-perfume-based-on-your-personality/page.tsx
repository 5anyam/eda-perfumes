import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'How to Choose a Perfume Based on Your Personality',
  description: 'Discover how to choose the perfect perfume based on your personality and Indian summer climate. Find the best summer fragrances for men with expert tips.',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/how-to-choose-perfume-based-on-your-personality' },
  keywords: ['Best Summer Perfumes For Men', 'Top 10 Perfume Brands For Male In India', 'perfume based on personality', 'summer fragrances for men'],
  openGraph: {
    title: 'How to Choose a Perfume Based on Your Personality',
    description: 'Discover how to choose the perfect perfume based on your personality and Indian summer climate. Find the best summer fragrances for men with expert tips.',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/how-to-choose-perfume-based-on-your-personality',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

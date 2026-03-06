import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'Craft a Mysterious Persona Through the Power of Scent',
  description: 'Discover how the right fragrance builds a mysterious persona. Explore the best perfume for men under 1000 and elegant woody floral perfumes for women.',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/craft-a-mysterious-persona-through-scent' },
  keywords: ['Best Perfume For Men Under 1000', 'Woody Floral Perfumes For Women', 'mysterious persona', 'signature scent'],
  openGraph: {
    title: 'Craft a Mysterious Persona Through the Power of Scent',
    description: 'Discover how the right fragrance builds a mysterious persona. Explore the best perfume for men under 1000 and elegant woody floral perfumes for women.',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/craft-a-mysterious-persona-through-scent',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

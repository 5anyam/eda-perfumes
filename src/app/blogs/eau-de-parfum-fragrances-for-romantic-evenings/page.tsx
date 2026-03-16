import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'Eau de Parfum Fragrances for Unforgettable Romantic Evenings',
  description: 'Discover the eau de parfum for men and eau de parfum meaning, how these rich fragrances create unforgettable romantic evenings. Explore elegant oud scents.',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/eau-de-parfum-fragrances-for-romantic-evenings' },
  keywords: ['Eau de Parfum', 'Eau de Parfum for Men', 'Eau de Parfum Meaning'],
  openGraph: {
    title: 'Eau de Parfum Fragrances for Unforgettable Romantic Evenings',
    description: 'Discover the eau de parfum for men and eau de parfum meaning, how these rich fragrances create unforgettable romantic evenings. Explore elegant oud scents.',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/eau-de-parfum-fragrances-for-romantic-evenings',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

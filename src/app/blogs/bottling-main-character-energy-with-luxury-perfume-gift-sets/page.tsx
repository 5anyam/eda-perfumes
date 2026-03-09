import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'Bottling Main Character Energy with Luxury Perfume Gift Sets',
  description: 'Discover how EDA Perfumes\' luxury perfume gift sets and office perfume for men elevate your presence. Find scents that boost confidence, and give the main character energy.',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/bottling-main-character-energy-with-luxury-perfume-gift-sets' },
  keywords: ['Office Perfumes for Men', 'Luxury Perfume Gift Sets', 'luxury fragrance', 'office perfume', 'unisex perfume'],
  openGraph: {
    title: 'Bottling Main Character Energy with Luxury Perfume Gift Sets',
    description: 'Discover how EDA Perfumes\' luxury perfume gift sets and office perfume for men elevate your presence. Find scents that boost confidence, and give the main character energy.',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/bottling-main-character-energy-with-luxury-perfume-gift-sets',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

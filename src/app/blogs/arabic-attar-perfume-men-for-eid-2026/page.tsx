import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'Arabic Attar Perfume for Men Luxury Fragrances for Eid 2026',
  description: 'This Eid 2026, elevate your presence with Arabic attar perfumes for men from EDA Perfumes. Enjoy heritage, luxury, and long-lasting fragrance in every drop.',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/arabic-attar-perfume-men-for-eid-2026' },
  keywords: ['Arabic Attar Perfumes for Men', 'Attar Perfume For Men', 'Attar Perfumes For Eid'],
  openGraph: {
    title: 'Arabic Attar Perfume for Men Luxury Fragrances for Eid 2026',
    description: 'This Eid 2026, elevate your presence with Arabic attar perfumes for men from EDA Perfumes. Enjoy heritage, luxury, and long-lasting fragrance in every drop.',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/arabic-attar-perfume-men-for-eid-2026',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

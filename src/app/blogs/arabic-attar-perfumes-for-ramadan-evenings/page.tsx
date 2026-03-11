import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'Arabic Attar Perfumes for Ramadan Evening Gatherings and Iftar',
  description: 'Discover the elegance of Arabic attar perfumes for Ramadan gatherings. Explore long lasting oud, amber, and musk attars by EDA Perfumes, perfect for prayers, iftar, and evening celebrations.',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/arabic-attar-perfumes-for-ramadan-evenings' },
  keywords: ['Arabic Attar Perfumes for Ramadan', 'Attar Perfume For Men', 'Oud Pocket Perfume', 'Ramadan fragrance', 'oud attar'],
  openGraph: {
    title: 'Arabic Attar Perfumes for Ramadan Evening Gatherings and Iftar',
    description: 'Discover the elegance of Arabic attar perfumes for Ramadan gatherings. Explore long lasting oud, amber, and musk attars by EDA Perfumes, perfect for prayers, iftar, and evening celebrations.',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/arabic-attar-perfumes-for-ramadan-evenings',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

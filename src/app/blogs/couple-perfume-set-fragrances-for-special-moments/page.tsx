import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'Couple Perfume Set: Fragrances for Special Moments',
  description: 'Discover elegant couple perfume sets that turn everyday moments into lasting memories. Explore long-lasting fragrances by EDA Perfumes made for couples.',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/couple-perfume-set-fragrances-for-special-moments' },
  keywords: ['Couple Perfume Set', 'Couple Perfume Gift Set'],
  openGraph: {
    title: 'Couple Perfume Set: Fragrances for Special Moments',
    description: 'Discover elegant couple perfume sets that turn everyday moments into lasting memories. Explore long-lasting fragrances by EDA Perfumes made for couples.',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/couple-perfume-set-fragrances-for-special-moments',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

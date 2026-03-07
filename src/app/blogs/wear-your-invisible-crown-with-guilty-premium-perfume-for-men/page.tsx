import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'Wear Your Invisible Crown with Guilty Premium Perfume for Men',
  description: 'Discover how a guilty premium perfume for men enhances confidence, personal style, and presence. Learn how to choose signature and summer fragrances.',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/wear-your-invisible-crown-with-guilty-premium-perfume-for-men' },
  keywords: ['Guilty Premium Perfume For Men', 'Best Summer Perfumes For Men', 'signature fragrance', 'luxury perfume'],
  openGraph: {
    title: 'Wear Your Invisible Crown with Guilty Premium Perfume for Men',
    description: 'Discover how a guilty premium perfume for men enhances confidence, personal style, and presence. Learn how to choose signature and summer fragrances.',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/wear-your-invisible-crown-with-guilty-premium-perfume-for-men',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'Woody Perfume for Men That Leaves a Lasting Afterglow',
  description: 'Discover woody perfume for men that lasts all day Learn about fragrance notes longevity and how to choose a scent that leaves a lasting impression',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/woody-perfume-for-men-for-a-lasting-afterglow' },
  keywords: ['Woody Perfume For Men', 'Best Woody Perfumes For Him'],
  openGraph: {
    title: 'Woody Perfume for Men That Leaves a Lasting Afterglow',
    description: 'Discover woody perfume for men that lasts all day Learn about fragrance notes longevity and how to choose a scent that leaves a lasting impression',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/woody-perfume-for-men-for-a-lasting-afterglow',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

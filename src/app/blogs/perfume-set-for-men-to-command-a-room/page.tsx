import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'Perfume Set For Men To Command A Room With Sillage',
  description: 'Discover how a perfume set for men helps you build strong sillage Learn fragrance tips layering and how to create a lasting impression',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/perfume-set-for-men-to-command-a-room' },
  keywords: ['Perfume Set For Men', 'Best Perfume Of Men Under 1000'],
  openGraph: {
    title: 'Perfume Set For Men To Command A Room With Sillage',
    description: 'Discover how a perfume set for men helps you build strong sillage Learn fragrance tips layering and how to create a lasting impression',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/perfume-set-for-men-to-command-a-room',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

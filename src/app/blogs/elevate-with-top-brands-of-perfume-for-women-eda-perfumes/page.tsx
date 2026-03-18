import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'Elevate your Frequency with EDA Perfumes Top Brands of Perfume for Women',
  description: 'Explore one of the top brands of perfume for women and discover elegant long lasting scents by EDA Perfumes to find your perfect signature perfume for women',
  alternates: { canonical: 'https://www.edaperfumes.com/blogs/elevate-with-top-brands-of-perfume-for-women-eda-perfumes' },
  keywords: ['Top Brands Of Perfume For Women'],
  openGraph: {
    title: 'Elevate your Frequency with EDA Perfumes Top Brands of Perfume for Women',
    description: 'Explore one of the top brands of perfume for women and discover elegant long lasting scents by EDA Perfumes to find your perfect signature perfume for women',
    type: 'article',
    url: 'https://www.edaperfumes.com/blogs/elevate-with-top-brands-of-perfume-for-women-eda-perfumes',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

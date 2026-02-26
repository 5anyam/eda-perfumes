import { Metadata } from 'next';
import BlogArticle from './BlogArticle';

export const metadata: Metadata = {
  title: 'The Art of Wearing a Seductive Fragrance Elegantly',
  description: 'Master the art of seduction with luxury fragrances. Oud and woody perfumes for men, elegantly presented in a luxury perfume box for style and confidence.',
  alternates: { canonical: 'https://www.edaperfumes.com/blog/art-of-wearing-seductive-fragrance-with-confidence' },
  keywords: ['Luxury Perfume Box', 'Seductive Perfumes for Men', 'oud perfume for men', 'woody perfume for men', 'luxury perfume gift sets'],
  openGraph: {
    title: 'The Art of Wearing a Seductive Fragrance Elegantly',
    description: 'Master the art of seduction with luxury fragrances. Oud and woody perfumes for men, elegantly presented in a luxury perfume box for style and confidence.',
    type: 'article',
    url: 'https://www.edaperfumes.com/blog/art-of-wearing-seductive-fragrance-with-confidence',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BlogPostPage() {
  return <BlogArticle />;
}

import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About EDA Perfumes | Luxury Unisex Fragrances',
  description: 'Learn about EDA Perfumes - crafting sophisticated luxury unisex fragrances with premium ingredients for those who appreciate elegance.',
  alternates: { canonical: 'https://www.edaperfumes.com/about' },
  openGraph: {
    title: 'About EDA Perfumes',
    description: 'Crafting sophisticated fragrances for those who appreciate luxury and elegance.',
    type: 'website',
    url: 'https://www.edaperfumes.com/about',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

import { fetchWPPageOptions } from '../../../lib/wordpress-blog';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const options = await fetchWPPageOptions('about');
  return <AboutClient options={options} />;
}

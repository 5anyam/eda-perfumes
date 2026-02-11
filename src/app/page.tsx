import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'EDA Perfumes Luxury Long Lasting Unisex Fragrances',
  description: 'Discover EDA Perfumes luxury unisex fragrances crafted with premium ingredients and long lasting EDP concentration. Shop elegant scents for every occasion.',
};

export default function HomePage() {
  return <HomeClient />;
}

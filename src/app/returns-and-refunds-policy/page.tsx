import { Metadata } from 'next';
import ReturnsClient from './ReturnsClient';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy | EDA Perfumes',
  description: 'Learn about the EDA Perfumes returns and refunds policy. 7-day return policy for damaged or defective luxury fragrances.',
  alternates: { canonical: 'https://www.edaperfumes.com/returns-and-refunds-policy' },
  openGraph: {
    title: 'Returns & Refunds Policy | EDA Perfumes',
    description: '7-day return policy for EDA Perfumes luxury fragrances.',
    type: 'website',
    url: 'https://www.edaperfumes.com/returns-and-refunds-policy',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function ReturnsPage() {
  return <ReturnsClient />;
}

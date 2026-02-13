import { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Search | EDA Perfumes',
  description: 'Search for your favourite EDA Perfumes luxury fragrances.',
  alternates: { canonical: 'https://www.edaperfumes.com/search' },
  robots: { index: false, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function SearchPage() {
  return <SearchClient />;
}

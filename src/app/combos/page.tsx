import { Metadata } from 'next';
import CombosPageClient from './CombosPageClient';

export const metadata: Metadata = {
  title: 'Fragrance Combos - Eda Perfumes',
  description: 'Curated perfume combinations at special bundle prices',
  alternates: { canonical: 'https://www.edaperfumes.com/combos' },
  openGraph: {
    title: 'Fragrance Combos - Eda Perfumes',
    description: 'Curated perfume combinations at special bundle prices',
    type: 'website',
    url: 'https://www.edaperfumes.com/combos',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function CombosPage() {
  return <CombosPageClient />;
}

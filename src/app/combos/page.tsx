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

import { fetchWPPageOptions } from '../../../lib/wordpress-blog';

export const dynamic = 'force-dynamic';

export default async function CombosPage() {
  const options = await fetchWPPageOptions('combos');
  return <CombosPageClient options={options} />;
}

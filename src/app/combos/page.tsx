import type { Metadata } from 'next';
import CombosPageClient from './CombosPageClient';
import PageSchemas from '../../../components/PageSchemas';
import { fetchWPPageOptions, fetchPageSeo } from '../../../lib/wordpress-blog';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('combos');
  const title = yoast?.title || 'Fragrance Combos - Eda Perfumes';
  const description = yoast?.description || 'Curated perfume combinations at special bundle prices';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/combos';
  return {
    title, description,
    alternates: { canonical },
    openGraph: {
      title: yoast?.og_title || title, description: yoast?.og_description || description,
      type: 'website', url: canonical,
      ...(yoast?.og_image?.[0]?.url && { images: [{ url: yoast.og_image[0].url }] }),
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://www.edaperfumes.com'),
  };
}

export default async function CombosPage() {
  const options = await fetchWPPageOptions('combos');
  return <><PageSchemas slug="combos" /><CombosPageClient options={options} /></>;
}

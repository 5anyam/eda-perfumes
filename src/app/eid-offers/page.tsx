import type { Metadata } from 'next';
import EidOffersClient from './EidOffersClient';
import PageSchemas from '../../../components/PageSchemas';
import { fetchWPPageOptions, fetchPageSeo } from '../../../lib/wordpress-blog';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('eid-offers');
  const title = yoast?.title || 'Eid Special Offer @ ₹899 | Oudh Shukran + 100ml + 10ml FREE | Eda Perfumes';
  const description = yoast?.description || 'Celebrate Eid with EDA Perfumes! Get Oudh Shukran 100ml + any 100ml perfume + any 10ml travel size perfume — all at just ₹899. Limited time Eid special offer.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/eid-offers';
  return {
    title, description,
    keywords: yoast?.focuskw || 'eid perfume offer, oudh shukran, eda perfumes, eid gift, perfume deal, ramadan offer',
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

export default async function EidOffersPage() {
  const options = await fetchWPPageOptions('eid-offers');
  return <><PageSchemas slug="eid-offers" /><EidOffersClient options={options} /></>;
}

import type { Metadata } from 'next';
import { fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';
import BuyThreeGetGiftsClient from './BuyThreeGetGiftsClient';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('buy-three-get-gifts');
  const title = yoast?.title || 'Buy 3 @ ₹1299 + Get 5 FREE Gifts | Eda Perfumes';
  const description = yoast?.description || 'Ultimate perfume deal - Buy any 3 signature perfumes at just ₹1299 and get 5 travel size 10ml perfumes as FREE gifts! Best value offer at Eda Perfumes.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/buy-three-get-gifts';
  return {
    title, description,
    keywords: yoast?.focuskw || 'perfume offer, buy 3 get gifts, eda perfumes, fragrance deal, perfume bundle, best perfume offer',
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

export default function BuyThreeGetGiftsPage() {
  return <><PageSchemas slug="buy-three-get-gifts" /><BuyThreeGetGiftsClient /></>;
}

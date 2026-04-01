import type { Metadata } from 'next';
import { fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';
import BuyTwoGetFreeClient from './BuyTwoGetFreeClient';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('buy-two-get-free');
  const title = yoast?.title || 'Buy 2 @ ₹899 + Get 4×10ml FREE | Eda Perfumes';
  const description = yoast?.description || 'Exclusive offer - Buy any 2 signature perfumes at just ₹899 and get 4 travel size 10ml perfumes absolutely FREE! Limited time offer at Eda Perfumes.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/buy-two-get-free';
  return {
    title, description,
    keywords: yoast?.focuskw || 'perfume offer, buy 2 get free, eda perfumes, fragrance deal, perfume discount',
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

export default function BuyTwoGetFreePage() {
  return <><PageSchemas slug="buy-two-get-free" /><BuyTwoGetFreeClient /></>;
}

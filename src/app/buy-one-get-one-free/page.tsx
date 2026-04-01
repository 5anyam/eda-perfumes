import type { Metadata } from 'next';
import { fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';
import BuyOneGetOneFreeClient from './BuyOneGetOneFreeClient';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('buy-one-get-one-free');
  const title = yoast?.title || 'Buy 1 Get 1 FREE @ ₹399 | Eda Perfumes';
  const description = yoast?.description || 'Buy any 100ml signature perfume and get a 10ml travel size FREE at just ₹399. Premium eau de parfum deal at Eda Perfumes.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/buy-one-get-one-free';
  return {
    title, description,
    keywords: yoast?.focuskw || 'buy 1 get 1, perfume deal, eda perfumes, fragrance offer, perfume bundle, free perfume',
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

export default function BuyOneGetOneFreePage() {
  return <><PageSchemas slug="buy-one-get-one-free" /><BuyOneGetOneFreeClient /></>;
}

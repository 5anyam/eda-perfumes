import type { Metadata } from 'next';
import { fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';
import ReturnsClient from './ReturnsClient';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('returns-and-refunds-policy');
  const title = yoast?.title || 'Returns & Refunds Policy | EDA Perfumes';
  const description = yoast?.description || 'Learn about the EDA Perfumes returns and refunds policy. 7-day return policy for damaged or defective luxury fragrances.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/returns-and-refunds-policy';
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

export default function ReturnsPage() {
  return <><PageSchemas slug="returns-and-refunds-policy" /><ReturnsClient /></>;
}

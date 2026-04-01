import type { Metadata } from 'next';
import { fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';
import DisclaimerClient from './DisclaimerClient';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('disclaimer');
  const title = yoast?.title || 'Disclaimer | EDA Perfumes';
  const description = yoast?.description || 'Disclaimer for EDA Perfumes products and services.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/disclaimer';
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

export default function DisclaimerPage() {
  return <><PageSchemas slug="disclaimer" /><DisclaimerClient /></>;
}

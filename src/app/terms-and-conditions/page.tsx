import type { Metadata } from 'next';
import { fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';
import TermsClient from './TermsClient';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('terms-and-conditions');
  const title = yoast?.title || 'Terms & Conditions | EDA Perfumes';
  const description = yoast?.description || 'Read the terms and conditions for using the EDA Perfumes website and purchasing our luxury fragrances.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/terms-and-conditions';
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

export default function TermsPage() {
  return <><PageSchemas slug="terms-and-conditions" /><TermsClient /></>;
}

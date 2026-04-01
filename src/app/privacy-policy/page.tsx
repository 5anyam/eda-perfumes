import type { Metadata } from 'next';
import { fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';
import PrivacyPolicyClient from './PrivacyPolicyClient';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('privacy-policy');
  const title = yoast?.title || 'Privacy Policy | EDA Perfumes';
  const description = yoast?.description || 'Read the EDA Perfumes privacy policy to understand how we collect, use, and protect your personal information.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/privacy-policy';
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

export default function PrivacyPolicyPage() {
  return <><PageSchemas slug="privacy-policy" /><PrivacyPolicyClient /></>;
}

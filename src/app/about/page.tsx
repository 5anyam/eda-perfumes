import type { Metadata } from 'next';
import AboutClient from './AboutClient';
import PageSchemas from '../../../components/PageSchemas';
import { fetchWPPageOptions, fetchPageSeo } from '../../../lib/wordpress-blog';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('about');
  const title = yoast?.title || 'About EDA Perfumes | Luxury Unisex Fragrances';
  const description = yoast?.description || 'Learn about EDA Perfumes - crafting sophisticated luxury unisex fragrances with premium ingredients for those who appreciate elegance.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/about';
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

export default async function AboutPage() {
  const options = await fetchWPPageOptions('about');
  return <><PageSchemas slug="about" /><AboutClient options={options} /></>;
}

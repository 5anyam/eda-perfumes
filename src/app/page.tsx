import type { Metadata } from 'next';
import ComingSoon from '../../components/ComingSoon';
import PageSchemas from '../../components/PageSchemas';
import { fetchPageSeo } from '../../lib/wordpress-blog';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('home')

  const brand = 'EDA Perfumes'
  const fallbackTitle = 'EDA Perfumes Luxury Long-Lasting Unisex Fragrances'
  const fallbackDescription = 'Discover EDA Perfumes luxury unisex fragrances with long-lasting premium scents for men and women crafted for confidence, and everyday wear across every occasion.'
  const fallbackCanonical = 'https://www.edaperfumes.com/'

  // Filter incomplete Rank Math templates (e.g. 'Eda Perfumes -' when tagline is empty)
  const rawTitle = yoast?.title?.trim() || ''
  const validTitle = rawTitle && !rawTitle.endsWith(' -') && !rawTitle.endsWith('- ') && rawTitle !== brand
  const title = validTitle ? rawTitle : fallbackTitle
  const description = yoast?.description || fallbackDescription
  const canonical = yoast?.canonical || fallbackCanonical

  const ogTitle = yoast?.og_title?.trim() || title
  const ogDescription = yoast?.og_description || description
  const ogImage = yoast?.og_image?.[0]?.url || '/eda-perfumes-logo.jpeg'

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: yoast?.og_site_name || brand,
      images: [{ url: ogImage, width: 1200, height: 630, alt: brand }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://www.edaperfumes.com'),
  }
}

export default function HomePage() {
  return <><PageSchemas slug="home" /><ComingSoon /></>;
}

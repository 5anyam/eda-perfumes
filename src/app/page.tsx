import type { Metadata } from 'next';
import HomeClient from './HomeClient';

async function fetchHomeYoastSeo() {
  try {
    const res = await fetch(
      'https://cms.edaperfumes.com/wp-json/wp/v2/pages?slug=home&_fields=yoast_head_json',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.[0]?.yoast_head_json ?? null
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchHomeYoastSeo()

  const brand = 'EDA Perfumes'
  const fallbackTitle = 'EDA Perfumes Luxury Long Lasting Unisex Fragrances'
  const fallbackDescription = 'Discover EDA Perfumes luxury unisex fragrances crafted with premium ingredients and long lasting EDP concentration. Shop elegant scents for every occasion.'
  const fallbackCanonical = 'https://www.edaperfumes.com/'

  const title = yoast?.title || fallbackTitle
  const description = yoast?.description || fallbackDescription
  const canonical = yoast?.canonical || fallbackCanonical

  const ogTitle = yoast?.og_title || title
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
  return <HomeClient />;
}

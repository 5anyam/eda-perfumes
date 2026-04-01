import type { Metadata } from 'next';
import { fetchProducts } from "../../../lib/woocommerceApi";
import { fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';
import LuxuryPerfumeClient from "./LuxuryPerfumeClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('luxury-perfume');
  const title = yoast?.title || 'Luxury Perfume Experience Timeless Elegance with EDA Perfumes';
  const description = yoast?.description || 'Experience the elegance of luxury perfume with EDA Perfumes. Explore our premium fragrances, gift sets, and beautifully crafted scents for unforgettable moments.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/luxury-perfume';
  return {
    title, description,
    alternates: { canonical },
    openGraph: {
      title: yoast?.og_title || title, description: yoast?.og_description || description,
      type: 'website', url: canonical,
      siteName: yoast?.og_site_name || 'EDA Perfumes',
      ...(yoast?.og_image?.[0]?.url && { images: [{ url: yoast.og_image[0].url }] }),
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://www.edaperfumes.com'),
  };
}

export interface Product {
  id: number;
  name: string;
  price: string;
  slug: string;
  description?: string;
  short_description?: string;
  images?: { src: string }[];
  attributes?: { option: string }[];
  categories?: { name: string }[];
  tags?: { name: string }[];
}

export default async function LuxuryPerfumePage() {
  let products: Product[] = [];
  try {
    const result = await fetchProducts();
    products = result as Product[];
  } catch {
    products = [];
  }

  return <><PageSchemas slug="luxury-perfume" /><LuxuryPerfumeClient products={products} /></>;
}

import { Metadata } from 'next';
import { fetchProducts } from "../../../lib/woocommerceApi";
import LuxuryPerfumeClient from "./LuxuryPerfumeClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Luxury Perfume Experience Timeless Elegance with EDA Perfumes',
  description: 'Experience the elegance of luxury perfume with EDA Perfumes. Explore our premium fragrances, gift sets, and beautifully crafted scents for unforgettable moments.',
  alternates: { canonical: 'https://www.edaperfumes.com/luxury-perfume' },
  openGraph: {
    title: 'Luxury Perfume Experience Timeless Elegance with EDA Perfumes',
    description: 'Experience the elegance of luxury perfume with EDA Perfumes. Explore our premium fragrances, gift sets, and beautifully crafted scents for unforgettable moments.',
    type: 'website',
    url: 'https://www.edaperfumes.com/luxury-perfume',
    siteName: 'EDA Perfumes',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

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

  return <LuxuryPerfumeClient products={products} />;
}

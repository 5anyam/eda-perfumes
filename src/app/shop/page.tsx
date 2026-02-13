import { Metadata } from 'next';
import { fetchProducts } from "../../../lib/woocommerceApi";
import ShopPageClient from "./shopPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Shop All Perfumes | EDA Perfumes',
  description: 'Browse the complete collection of EDA Perfumes luxury unisex fragrances. Premium long-lasting Eau de Parfum for every occasion.',
  alternates: { canonical: 'https://www.edaperfumes.com/shop' },
  openGraph: {
    title: 'Shop All Perfumes | EDA Perfumes',
    description: 'Browse the complete collection of EDA Perfumes luxury unisex fragrances.',
    type: 'website',
    url: 'https://www.edaperfumes.com/shop',
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

export default async function ShopPage() {
  let products: Product[] = [];
  try {
    const result = await fetchProducts();
    products = result as Product[];
  } catch {
    products = [];
  }

  return <ShopPageClient products={products} />;
}
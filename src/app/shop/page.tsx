import type { Metadata } from 'next';
import { fetchProducts } from "../../../lib/woocommerceApi";
import { fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';
import ShopPageClient from "./shopPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('shop');
  const title = yoast?.title || 'Shop All Perfumes | EDA Perfumes';
  const description = yoast?.description || 'Browse the complete collection of EDA Perfumes luxury unisex fragrances. Premium long-lasting Eau de Parfum for every occasion.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/shop';
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

  return <><PageSchemas slug="shop" /><ShopPageClient products={products} /></>;
}
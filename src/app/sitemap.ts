import type { MetadataRoute } from 'next';

export const revalidate = 3600;

const BASE_URL = 'https://www.edaperfumes.com';
const WC_API = process.env.API_BASE || 'https://cms.edaperfumes.com/wp-json/wc/v3';
const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET || '';

async function fetchAllProducts(): Promise<{ slug: string; modified: string }[]> {
  const all: { slug: string; modified: string }[] = [];
  let page = 1;

  while (true) {
    const url = `${WC_API}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100&page=${page}&status=publish`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) break;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    for (const p of data) {
      all.push({ slug: p.slug, modified: p.date_modified || new Date().toISOString() });
    }
    if (data.length < 100) break;
    page++;
  }

  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static pages (manually listed)
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.00 },

    // Special offers
    { url: `${BASE_URL}/buy-two-get-free`, lastModified: now, changeFrequency: 'weekly', priority: 0.90 },
    { url: `${BASE_URL}/buy-three-get-gifts`, lastModified: now, changeFrequency: 'weekly', priority: 0.90 },
    { url: `${BASE_URL}/buy-one-get-one-free`, lastModified: now, changeFrequency: 'weekly', priority: 0.90 },

    // Static pages
    { url: `${BASE_URL}/combos`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/shop`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/cart`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/returns-and-refunds-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/disclaimer`, lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.50 },

    // Blog
    { url: `${BASE_URL}/blogs`, lastModified: now, changeFrequency: 'weekly', priority: 0.80 },
    { url: `${BASE_URL}/blogs/art-of-wearing-seductive-fragrance-with-confidence`, lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blogs/how-to-choose-perfume-based-on-your-personality`, lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blogs/craft-a-mysterious-persona-through-scent`, lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blogs/arabic-attar-perfume-for-men-for-eid-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blogs/eau-de-parfum-fragrances-for-romantic-evenings`, lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blogs/couple-perfume-set-fragrances-for-special-moments`, lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blogs/elevate-with-top-brands-of-perfume-for-women-eda-perfumes`, lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blogs/woody-perfume-for-men-for-a-lasting-afterglow`, lastModified: now, changeFrequency: 'monthly', priority: 0.70 },

    // Luxury perfume
    { url: `${BASE_URL}/luxury-perfume`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },

    // Eid offers
    { url: `${BASE_URL}/eid-offers`, lastModified: now, changeFrequency: 'weekly', priority: 0.90 },
  ];

  // Dynamic product pages (auto-fetched from WooCommerce)
  const products = await fetchAllProducts();
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.modified,
    changeFrequency: 'monthly',
    priority: 0.64,
  }));

  return [...staticPages, ...productPages];
}

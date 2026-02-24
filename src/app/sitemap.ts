import type { MetadataRoute } from 'next';

export const revalidate = 3600;

const BASE_URL = 'https://www.edaperfumes.com';
const WC_API = 'https://cms.edaperfumes.com/wp-json/wc/v3';
const CONSUMER_KEY = process.env.CONSUMER_KEY || 'ck_b1a13e4236dd41ec9b8e6a1720a69397ddd12da6';
const CONSUMER_SECRET = process.env.CONSUMER_SECRET || 'cs_d8439cfabc73ad5b9d82d1d3facea6711f24dfd1';

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
    { url: `${BASE_URL}/valentine-gift-pack`, lastModified: now, changeFrequency: 'weekly', priority: 0.90 },
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

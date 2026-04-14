import type { MetadataRoute } from 'next';
import { fetchAllBlogSlugs } from '../../lib/wordpress-blog';

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

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.00 },

    // Shop & collections
    { url: `${BASE_URL}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.90 },
    { url: `${BASE_URL}/combos`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/luxury-perfume`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },

    // Special offers & promos
    { url: `${BASE_URL}/buy-two-get-free`, lastModified: now, changeFrequency: 'weekly', priority: 0.90 },
    { url: `${BASE_URL}/buy-three-get-gifts`, lastModified: now, changeFrequency: 'weekly', priority: 0.90 },
    { url: `${BASE_URL}/buy-one-get-one-free`, lastModified: now, changeFrequency: 'weekly', priority: 0.90 },
    { url: `${BASE_URL}/valentine-gift-pack`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/couple-perfume-set`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/eau-de-parfum`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/long-lasting-perfume-for-men-and-women`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/best-perfume-for-men`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },

    // Core pages
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/cart`, lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/checkout`, lastModified: now, changeFrequency: 'monthly', priority: 0.70 },

    // Blog index
    { url: `${BASE_URL}/blogs`, lastModified: now, changeFrequency: 'weekly', priority: 0.80 },

    // Legal & utility
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${BASE_URL}/returns-and-refunds-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.50 },
    { url: `${BASE_URL}/disclaimer`, lastModified: now, changeFrequency: 'monthly', priority: 0.40 },
    { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.30 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.40 },
  ];

  // Dynamic product pages (auto-fetched from WooCommerce)
  const products = await fetchAllProducts();
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.modified,
    changeFrequency: 'monthly',
    priority: 0.64,
  }));

  // Dynamic blog pages from WordPress (auto-fetched, no hardcoding needed)
  const wpBlogs = await fetchAllBlogSlugs();
  const wpBlogPages: MetadataRoute.Sitemap = wpBlogs.map((b) => ({
    url: `${BASE_URL}/blogs/${b.slug}`,
    lastModified: b.modified,
    changeFrequency: 'monthly',
    priority: 0.70,
  }));

  return [...staticPages, ...productPages, ...wpBlogPages];
}

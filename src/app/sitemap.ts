import type { MetadataRoute } from 'next';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const staticPages: MetadataRoute.Sitemap = [
    // Homepage
    { url: 'https://www.edaperfumes.com/', lastModified: new Date('2026-01-31'), changeFrequency: 'daily', priority: 1.00 },

    // Main products (100ml)
    { url: 'https://www.edaperfumes.com/product/bite-me-seductive-floral-citrus-eau-de-parfum', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/product/nude-poison-elegant-unisex-eau-de-parfum-100ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/product/bad-habits-eau-de-parfum-100ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/product/oudh-shukran-eau-de-parfum-100ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/product/lusty-nights-premium-unisex-eau-de-parfum-100ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/product/guilty-premium-eau-de-parfum-100ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },

    // Static pages
    { url: 'https://www.edaperfumes.com/combos', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/shop', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/about', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/cart', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/contact', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/privacy-policy', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/terms-and-conditions', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },
    { url: 'https://www.edaperfumes.com/returns-and-refunds-policy', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.80 },

    // Combo products
    { url: 'https://www.edaperfumes.com/product/bad-habits-and-bite-me', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/bad-habits-and-guilty', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/bad-habits-and-lusty-nights', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/bite-me-and-oudh-shukran', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/guilty-and-bite-me', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/guilty-and-lusty-nights', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/guilty-and-nude-poison', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/guilty-and-oudh-shukran', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/lusty-nights-and-bite-me', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/lusty-nights-and-oudh-shukran', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/nude-poison-and-bad-habits', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/nude-poison-and-bite-me', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/nude-poison-and-lusty-nights', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/nude-poison-and-oudh-shukran', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/oudh-shukran-and-bad-habits', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },

    // 10ml variants
    { url: 'https://www.edaperfumes.com/product/bad-habits-eau-de-parfum-10ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/bite-me-seductive-floral-citrus-eau-de-parfum-10ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/guilty-premium-eau-de-parfum-10ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/lusty-nights-premium-unisex-eau-de-parfum-10ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/nude-poison-elegant-unisex-eau-de-parfum-10ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
    { url: 'https://www.edaperfumes.com/product/oudh-shukran-eau-de-parfum-10ml', lastModified: new Date('2026-01-31'), changeFrequency: 'monthly', priority: 0.64 },
  ];

  return [...staticPages];
}

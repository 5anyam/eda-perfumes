// app/products/[slug]/page.tsx (Server Component)
import type { Metadata, ResolvingMetadata } from 'next'
import ProductClient from './product-client'
import { fetchProducts } from '../../../../lib/woocommerceApi'

// ✅ Updated: Make params a Promise
type Props = { 
  params: Promise<{ slug: string }>  // ← Changed to Promise
}

type ProductWire = {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  description?: string
  short_description?: string
  images?: Array<{ src: string }>
  attributes?: Array<{ option: string }>
}

type ProductNormalized = {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  description?: string
  short_description?: string
  images: Array<{ src: string }>
  attributes?: Array<{ option: string }>
}

function normalizeProduct(p: ProductWire): ProductNormalized {
  return {
    ...p,
    images: Array.isArray(p.images) ? p.images : [],
  }
}

async function getAllProducts() {
  try {
    const products = await fetchProducts() as ProductWire[]
    return products.map(normalizeProduct)
  } catch {
    return []
  }
}

async function getProductBySlug(slug: string) {
  // Fetch directly by slug from WooCommerce API (handles all products, not just first 100)
  try {
    const ck = process.env.NEXT_PUBLIC_CONSUMER_KEY || ''
    const cs = process.env.NEXT_PUBLIC_CONSUMER_SECRET || ''
    const res = await fetch(
      `${process.env.API_BASE || 'https://cms.edaperfumes.com/wp-json/wc/v3'}/products?slug=${encodeURIComponent(slug)}&consumer_key=${ck}&consumer_secret=${cs}`,
      { cache: 'no-store' }
    )
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        return normalizeProduct(data[0] as ProductWire)
      }
    }
  } catch {
    // Fall through to local search
  }
  // Fallback: search in first page of products
  const products = await getAllProducts()
  return products.find(p => p.slug === slug || String(p.id) === slug)
}

// Fetch Yoast SEO data from WordPress REST API
async function fetchYoastSeo(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.edaperfumes.com'}/wp-json/wp/v2/product?slug=${slug}&_fields=yoast_head_json`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.[0]?.yoast_head_json ?? null
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const [product, yoast] = await Promise.all([
    getProductBySlug(slug),
    fetchYoastSeo(slug),
  ])

  if (!product) {
    return {
      title: 'Product not found | EDA Perfumes',
      description: 'The product you are looking for is unavailable.',
      robots: { index: false, follow: false },
    }
  }

  // Slug-based SEO overrides (take priority over Yoast)
  const seoOverrides: Record<string, { title: string; description: string }> = {
    'oudh-shukran-eau-de-parfum-10ml': {
      title: 'Oudh Shukran Pocket Spray Perfume – Luxury Arabic Attar in Travel Size',
      description: 'Experience the rich oriental essence of Oudh Shukran in a convenient pocket spray perfume. A premium blend of oud, woody, and citrus notes, perfect for men & women.',
    },
    'bite-me-seductive-floral-citrus-eau-de-parfum-10ml': {
      title: 'Bite Me Seductive Floral Citrus Pocket Size Perfume',
      description: 'Discover Bite Me seductive floral citrus in a convenient pocket size perfume. This floral citrus perfume for her blends vibrant citrus for long-lasting freshness.',
    },
    'guilty-premium-eau-de-parfum-10ml': {
      title: 'Guilty Premium Small Pocket Perfume – Bold & Expressive Fragrance',
      description: 'Experience Guilty Premium small pocket perfume, a compact fragrance for women. Inspired by Guilty Midnight Shades perfume for bold, long-lasting.',
    },
    'lusty-nights-premium-unisex-eau-de-parfum-10ml': {
      title: 'Lusty Nights Pocket Size Perfume – Premium Unisex Fragrance',
      description: 'Experience Lusty Nights premium pocket perfume, a premium unisex citrus fragrance with woody undertones. Long-lasting elegant convenient travel friendly spray.',
    },
    'nude-poison-elegant-unisex-eau-de-parfum-10ml': {
      title: 'Nude Poison Mini Pocket Perfume – Elegant Unisex Fragrance',
      description: 'Experience Nude Poison mini pocket perfume, an Elegant Unisex perfume with fresh citrus, soft florals, and subtle sandalwood, perfect for travel and luxury gifting.',
    },
    'bad-habits-eau-de-parfum-10ml': {
      title: 'Bad Habits Small Pocket Perfume – Seductive Fresh Citrus Fragrance',
      description: 'Experience Bad Habits small pocket perfume, a compact fragrance with fresh citrus and seductive floral notes. Perfect for women, long-lasting and vibrant day.',
    },
  }

  const brand = 'EDA Perfumes'
  const seoOverride = seoOverrides[product.slug]
  const fallbackTitle = `${product.name} | ${brand}`
  const fallbackDescription = `Shop ${product.name} at EDA Perfumes. Premium long-lasting Eau de Parfum crafted with luxury ingredients.`
  const fallbackCanonical = `https://www.edaperfumes.com/product/${product.slug}`

  const title = seoOverride?.title || yoast?.title || fallbackTitle
  const description = seoOverride?.description || yoast?.description || fallbackDescription
  const canonical = yoast?.canonical || fallbackCanonical

  const imageUrl = product.images?.[0]?.src || '/eda-perfumes-logo.jpeg'

  const ogTitle = yoast?.og_title || title
  const ogDescription = yoast?.og_description || description
  const ogImage = yoast?.og_image?.[0]?.url || imageUrl

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
      images: [{ url: ogImage, width: 1200, height: 630, alt: product.name }],
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

export default async function Page({ params }: Props) {
  const { slug } = await params
  const [product, products] = await Promise.all([
    getProductBySlug(slug).catch(() => undefined),
    getAllProducts(),
  ])
  return (
    <ProductClient
      initialProduct={product}
      allProductsInitial={products}
      slug={slug}
    />
  )
}

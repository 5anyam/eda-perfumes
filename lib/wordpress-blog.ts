// lib/wordpress-blog.ts

const WP_URL = process.env.WORDPRESS_BLOG_URL || 'https://cms.edaperfumes.com';
const WP_USER = process.env.WORDPRESS_APP_USER || '';
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD || '';

function getAuthHeaders(): HeadersInit {
  if (WP_USER && WP_APP_PASSWORD) {
    const auth = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
    return { Authorization: `Basic ${auth}` };
  }
  return {};
}

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  image: string;
  tags: string[];
}

function mapWPPost(post: WPPost): BlogPost {
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const tags = post._embedded?.['wp:term']?.[1]?.map((t) => t.name) || [];
  const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim();

  return {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    content: post.content.rendered,
    excerpt,
    date: post.date,
    modified: post.modified,
    image,
    tags,
  };
}

export async function fetchBlogPosts(perPage = 50): Promise<BlogPost[]> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=${perPage}&orderby=date&order=desc&_embed`,
      { headers: getAuthHeaders(), cache: 'no-store' }
    );
    if (!res.ok) return [];
    const posts: WPPost[] = await res.json();
    return posts.map(mapWPPost);
  } catch {
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`,
      { headers: getAuthHeaders(), cache: 'no-store' }
    );
    if (!res.ok) return null;
    const posts: WPPost[] = await res.json();
    if (posts.length === 0) return null;
    return mapWPPost(posts[0]);
  } catch {
    return null;
  }
}

export interface SeoMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export async function fetchSeoMeta(slug: string): Promise<SeoMeta | null> {
  try {
    const res = await fetch(`${WP_URL}/${slug}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NextJS)' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const html = await res.text();

    const extract = (pattern: RegExp): string => {
      const m = html.match(pattern);
      return m ? m[1].replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '';
    };

    return {
      title: extract(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/) || extract(/<title>([^<]*)<\/title>/),
      description: extract(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/),
      ogTitle: extract(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/),
      ogDescription: extract(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/),
      ogImage: extract(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/),
    };
  } catch {
    return null;
  }
}

// Plugin-agnostic SEO fetcher — works with Rank Math, Yoast, or any SEO plugin.
// Parses the rendered WordPress page HTML for meta tags and JSON-LD schemas (HFCM).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchPageSeo(slug: string, type: 'page' | 'product' = 'page'): Promise<any> {
  try {
    const pageUrl = type === 'product'
      ? `${WP_URL}/product/${slug}/`
      : slug === 'home' ? `${WP_URL}/` : `${WP_URL}/${slug}/`;
    const res = await fetch(pageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NextJS/15)' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const extract = (pattern: RegExp): string => {
      const m = html.match(pattern);
      return m ? m[1].replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : '';
    };

    const ogImageUrl = extract(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/);

    // Extract JSON-LD schemas (from HFCM, Rank Math, or any plugin)
    const schemas: string[] = [];
    const schemaRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let schemaMatch;
    while ((schemaMatch = schemaRegex.exec(html)) !== null) {
      schemas.push(schemaMatch[1].trim());
    }

    return {
      title: extract(/<title>([^<]*)<\/title>/),
      description: extract(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/),
      canonical: extract(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/),
      og_title: extract(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/),
      og_description: extract(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/),
      og_image: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
      og_site_name: extract(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']*)["']/),
      focuskw: extract(/<meta\s+name=["']keywords["']\s+content=["']([^"']*)["']/),
      schemas,
    };
  } catch {
    return null;
  }
}

/** @deprecated Use fetchPageSeo instead */
export const fetchPageYoastSeo = fetchPageSeo;

export interface WPPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  image: string;
}

export async function fetchWPPageBySlug(slug: string): Promise<WPPage | null> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const pages: WPPost[] = await res.json();
    if (pages.length === 0) return null;
    const page = pages[0];
    return {
      id: page.id,
      slug: page.slug,
      title: page.title.rendered,
      content: page.content.rendered,
      excerpt: page.excerpt.rendered.replace(/<[^>]+>/g, '').trim(),
      date: page.date,
      modified: page.modified,
      image: page._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    };
  } catch {
    return null;
  }
}

// Key-value options stored in WordPress page content as [key]value[/key]
export type PageOptions = Record<string, string>;

export async function fetchWPPageOptions(slug: string): Promise<PageOptions> {
  try {
    const page = await fetchWPPageBySlug(slug);
    if (!page) return {};
    const decoded = page.content.replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)));
    const options: PageOptions = {};
    const regex = /\[(\w+)\]([\s\S]*?)\[\/\1\]/g;
    let match;
    while ((match = regex.exec(decoded)) !== null) {
      options[match[1]] = match[2].replace(/<[^>]+>/g, '').trim();
    }
    // Also include featured image if present
    if (page.image) options['featured_image'] = page.image;
    return options;
  } catch {
    return {};
  }
}

export async function fetchAllBlogSlugs(): Promise<{ slug: string; modified: string }[]> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=100&_fields=slug,modified`,
      { headers: getAuthHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const posts: { slug: string; modified: string }[] = await res.json();
    return posts;
  } catch {
    return [];
  }
}

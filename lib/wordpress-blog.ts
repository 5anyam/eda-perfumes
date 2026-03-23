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
      { headers: getAuthHeaders(), next: { revalidate: 600 } }
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
      { headers: getAuthHeaders(), next: { revalidate: 600 } }
    );
    if (!res.ok) return null;
    const posts: WPPost[] = await res.json();
    if (posts.length === 0) return null;
    return mapWPPost(posts[0]);
  } catch {
    return null;
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

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const WP_URL = process.env.WORDPRESS_BLOG_URL || 'https://cms.edaperfumes.com';

  const results: Record<string, unknown> = {
    WORDPRESS_BLOG_URL: WP_URL,
    WORDPRESS_APP_USER: process.env.WORDPRESS_APP_USER ? 'SET' : 'NOT SET',
    WORDPRESS_APP_PASSWORD: process.env.WORDPRESS_APP_PASSWORD ? 'SET' : 'NOT SET',
  };

  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=3&_fields=id,slug,title,status`,
      { cache: 'no-store' }
    );
    results.apiStatus = res.status;
    results.apiStatusText = res.statusText;
    const data = await res.json();
    results.posts = data;
    results.postCount = Array.isArray(data) ? data.length : 'not array';
  } catch (err: unknown) {
    results.error = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(results);
}

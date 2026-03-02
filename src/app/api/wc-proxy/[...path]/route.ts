import { NextRequest, NextResponse } from "next/server";

const API_BASE = 'https://cms.edaperfumes.com/wp-json/wc/v3';
const CONSUMER_KEY = process.env.CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.CONSUMER_SECRET || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const wcPath = path.join('/');
    const { searchParams } = new URL(request.url);

    // Remove any client-sent credentials (they should not be trusted)
    searchParams.delete('consumer_key');
    searchParams.delete('consumer_secret');

    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const queryString = searchParams.toString();
    const url = `${API_BASE}/${wcPath}${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `WooCommerce API Error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[WC-Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

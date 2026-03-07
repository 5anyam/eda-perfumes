import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE || 'https://cms.edaperfumes.com/wp-json/wc/v3';
const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET || '';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product');
    const perPage = searchParams.get('per_page') || '100';
    const status = searchParams.get('status') || 'approved';

    if (!productId) {
      return NextResponse.json({ error: 'product parameter is required' }, { status: 400 });
    }

    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const url = `${API_BASE}/products/reviews?product=${productId}&per_page=${perPage}&status=${status}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[WC-API] Reviews fetch error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.product_id || !body.review || !body.reviewer || !body.rating) {
      return NextResponse.json(
        { error: 'Missing required fields: product_id, review, reviewer, rating' },
        { status: 400 }
      );
    }

    // Sanitize rating to be between 1-5
    const rating = Math.min(5, Math.max(1, parseInt(String(body.rating), 10)));

    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const payload = {
      product_id: parseInt(String(body.product_id), 10),
      review: String(body.review).slice(0, 5000),
      reviewer: String(body.reviewer).slice(0, 200),
      reviewer_email: body.reviewer_email ? String(body.reviewer_email).slice(0, 200) : '',
      rating,
      status: 'approved',
    };

    const url = `${API_BASE}/products/reviews`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: errText || 'Failed to submit review' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[WC-API] Review submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

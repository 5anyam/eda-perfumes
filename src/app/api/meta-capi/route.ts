// app/api/meta-capi/route.ts
// Proxy endpoint for Meta Conversions API (server-side events)

import { NextRequest, NextResponse } from 'next/server';
import { sendCAPIEvent, CAPIUserData, CAPICustomData } from '../../../../lib/meta-capi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_name, user_data, custom_data, event_source_url, event_id } = body;

    if (!event_name) {
      return NextResponse.json({ error: 'event_name is required' }, { status: 400 });
    }

    // Extract IP and User-Agent from the request for better matching
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || '';
    const clientUserAgent = request.headers.get('user-agent') || '';

    const userData: CAPIUserData = {
      ...(user_data || {}),
      clientIpAddress: clientIp,
      clientUserAgent: clientUserAgent,
    };

    const result = await sendCAPIEvent(
      event_name,
      userData,
      custom_data as CAPICustomData | undefined,
      event_source_url,
      event_id
    );

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('[META-CAPI-ROUTE] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// lib/meta-capi.ts
// Meta Conversions API (CAPI) - Server-side event tracking

import crypto from 'crypto';

const PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '';
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN || '';
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || '';
const API_VERSION = 'v21.0';

function hashSHA256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export interface CAPIUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbc?: string; // _fbc cookie
  fbp?: string; // _fbp cookie
}

export interface CAPICustomData {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  contents?: { id: string; quantity: number; item_price?: number }[];
  num_items?: number;
  order_id?: string;
  search_string?: string;
}

export interface CAPIEvent {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url?: string;
  action_source: 'website';
  user_data: Record<string, string | undefined>;
  custom_data?: CAPICustomData;
}

function buildUserData(user: CAPIUserData): Record<string, string | undefined> {
  const data: Record<string, string | undefined> = {};

  if (user.email) data.em = hashSHA256(user.email);
  if (user.phone) data.ph = hashSHA256(user.phone.replace(/[^0-9]/g, ''));
  if (user.firstName) data.fn = hashSHA256(user.firstName);
  if (user.lastName) data.ln = hashSHA256(user.lastName);
  if (user.city) data.ct = hashSHA256(user.city);
  if (user.state) data.st = hashSHA256(user.state);
  if (user.zipCode) data.zp = hashSHA256(user.zipCode);
  if (user.country) data.country = hashSHA256(user.country);
  if (user.clientIpAddress) data.client_ip_address = user.clientIpAddress;
  if (user.clientUserAgent) data.client_user_agent = user.clientUserAgent;
  if (user.fbc) data.fbc = user.fbc;
  if (user.fbp) data.fbp = user.fbp;

  return data;
}

export async function sendCAPIEvent(
  eventName: string,
  userData: CAPIUserData,
  customData?: CAPICustomData,
  eventSourceUrl?: string,
  eventId?: string
): Promise<{ success: boolean; error?: string }> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('[META-CAPI] Missing PIXEL_ID or ACCESS_TOKEN');
    return { success: false, error: 'Missing credentials' };
  }

  const event: CAPIEvent = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId || `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    event_source_url: eventSourceUrl,
    action_source: 'website',
    user_data: buildUserData(userData),
    custom_data: customData ? { ...customData, currency: customData.currency || 'INR' } : undefined,
  };

  const payload: Record<string, unknown> = {
    data: [event],
    access_token: ACCESS_TOKEN,
  };

  if (TEST_EVENT_CODE) {
    payload.test_event_code = TEST_EVENT_CODE;
  }

  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('[META-CAPI] Error:', JSON.stringify(result));
      return { success: false, error: result.error?.message || 'API error' };
    }

    console.log(`[META-CAPI] ${eventName} sent successfully. Events received: ${result.events_received}`);
    return { success: true };
  } catch (err) {
    console.error('[META-CAPI] Network error:', err);
    return { success: false, error: 'Network error' };
  }
}

// Convenience helpers for common e-commerce events

export async function trackCAPIPageView(userData: CAPIUserData, url: string) {
  return sendCAPIEvent('PageView', userData, undefined, url);
}

export async function trackCAPIViewContent(
  userData: CAPIUserData,
  product: { id: string; name: string; price: number },
  url: string
) {
  return sendCAPIEvent('ViewContent', userData, {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'INR',
  }, url);
}

export async function trackCAPIAddToCart(
  userData: CAPIUserData,
  product: { id: string; name: string; price: number; quantity: number },
  url: string
) {
  return sendCAPIEvent('AddToCart', userData, {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price * product.quantity,
    currency: 'INR',
    num_items: product.quantity,
    contents: [{ id: product.id, quantity: product.quantity, item_price: product.price }],
  }, url);
}

export async function trackCAPIInitiateCheckout(
  userData: CAPIUserData,
  items: { id: string; quantity: number; price: number }[],
  total: number,
  url: string
) {
  return sendCAPIEvent('InitiateCheckout', userData, {
    content_ids: items.map(i => i.id),
    content_type: 'product',
    value: total,
    currency: 'INR',
    num_items: items.reduce((s, i) => s + i.quantity, 0),
    contents: items.map(i => ({ id: i.id, quantity: i.quantity, item_price: i.price })),
  }, url);
}

export async function trackCAPIAddPaymentInfo(
  userData: CAPIUserData,
  items: { id: string; quantity: number }[],
  total: number,
  url: string
) {
  return sendCAPIEvent('AddPaymentInfo', userData, {
    content_ids: items.map(i => i.id),
    content_type: 'product',
    value: total,
    currency: 'INR',
  }, url);
}

export async function trackCAPIPurchase(
  userData: CAPIUserData,
  items: { id: string; quantity: number; price: number }[],
  total: number,
  orderId: string,
  url?: string,
  eventId?: string
) {
  return sendCAPIEvent('Purchase', userData, {
    content_ids: items.map(i => i.id),
    content_name: 'EDA Perfumes Order',
    content_type: 'product',
    value: total,
    currency: 'INR',
    num_items: items.reduce((s, i) => s + i.quantity, 0),
    contents: items.map(i => ({ id: i.id, quantity: i.quantity, item_price: i.price })),
    order_id: orderId,
  }, url, eventId);
}

export async function trackCAPISearch(userData: CAPIUserData, searchString: string, url: string) {
  return sendCAPIEvent('Search', userData, {
    search_string: searchString,
    content_type: 'product',
  }, url);
}

export async function trackCAPIContact(userData: CAPIUserData, url: string) {
  return sendCAPIEvent('Contact', userData, undefined, url);
}

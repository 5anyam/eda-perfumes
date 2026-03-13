
// app/api/woocommerce/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { trackCAPIPurchase, CAPIUserData } from "../../../../../lib/meta-capi";

const WOOCOMMERCE_CONFIG = {
  BASE_URL: process.env.API_BASE || 'https://cms.edaperfumes.com/wp-json/wc/v3',
  CONSUMER_KEY: process.env.NEXT_PUBLIC_CONSUMER_KEY || '',
  CONSUMER_SECRET: process.env.NEXT_PUBLIC_CONSUMER_SECRET || '',
};

// Known offer bundle totals — must match offer page prices exactly
const VALID_OFFER_TOTALS = [399, 899, 1099, 1299];

interface LineItem {
  product_id: number;
  quantity: number;
  subtotal: string;
  total: string;
}

async function fetchProductPrice(
  productId: number,
  auth: string
): Promise<{ id: number; price: string } | null> {
  try {
    const res = await fetch(
      `${WOOCOMMERCE_CONFIG.BASE_URL}/products/${productId}`,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { id: data.id, price: data.price };
  } catch {
    return null;
  }
}

function validateAndFixPrices(
  lineItems: LineItem[],
  realPrices: Map<number, string>
): { valid: boolean; error: string; fixedItems: LineItem[] } {
  const paidItems = lineItems.filter((li) => parseFloat(li.total) > 0);
  const freeItems = lineItems.filter((li) => parseFloat(li.total) === 0);
  const clientPaidTotal = paidItems.reduce((s, li) => s + parseFloat(li.total), 0);
  const isOfferOrder = freeItems.length > 0;

  if (isOfferOrder) {
    // ---- OFFER ORDER: validate total is a valid sum of known tiers ----
    const rounded = Math.round(clientPaidTotal);

    // Check if the total can be formed by summing any combination of valid tier prices
    // This handles single offers, multiples, and mixed offers (e.g. BOGO + Buy2 = 1198)
    const reachable = new Set<number>([0]);
    const queue = [0];
    let matchesTier = false;
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const tier of VALID_OFFER_TOTALS) {
        const next = current + tier;
        if (next === rounded) { matchesTier = true; break; }
        if (next < rounded && !reachable.has(next)) {
          reachable.add(next);
          queue.push(next);
        }
      }
      if (matchesTier) break;
    }

    if (!matchesTier) {
      return {
        valid: false,
        error: `Invalid offer total ₹${rounded}. Please re-add items from the offer page.`,
        fixedItems: lineItems,
      };
    }

    // Force free items to ₹0 (prevent someone injecting a negative total)
    const fixedItems = lineItems.map((li) =>
      parseFloat(li.total) === 0
        ? { ...li, subtotal: "0.00", total: "0.00" }
        : li
    );
    return { valid: true, error: "", fixedItems };
  }

  // ---- REGULAR ORDER: overwrite with real WooCommerce prices ----
  const fixedItems: LineItem[] = lineItems.map((li) => {
    const realPrice = realPrices.get(li.product_id);
    if (!realPrice) return li; // unknown product — WC will catch it
    const correct = (parseFloat(realPrice) * li.quantity).toFixed(2);
    return { ...li, subtotal: correct, total: correct };
  });

  return { valid: true, error: "", fixedItems };
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    const auth = Buffer.from(
      `${WOOCOMMERCE_CONFIG.CONSUMER_KEY}:${WOOCOMMERCE_CONFIG.CONSUMER_SECRET}`
    ).toString("base64");

    // --- Server-side price validation ---
    if (Array.isArray(orderData.line_items) && orderData.line_items.length > 0) {
      const lineItems: LineItem[] = orderData.line_items;

      // Fetch real prices for every product in the order
      const results = await Promise.all(
        lineItems.map((li) => fetchProductPrice(li.product_id, auth))
      );

      const realPrices = new Map<number, string>();
      for (const r of results) {
        if (r) realPrices.set(r.id, r.price);
      }

      const validation = validateAndFixPrices(lineItems, realPrices);

      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      orderData.line_items = validation.fixedItems;
    }

    console.log("[WC-API] Creating order with validated prices");

    const response = await fetch(`${WOOCOMMERCE_CONFIG.BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[WC-API] Error response:", errorText);
      throw new Error(
        `WooCommerce API Error: ${response.status} - ${errorText}`
      );
    }

    const order = await response.json();
    console.log("[WC-API] Order created successfully:", {
      id: order.id,
      status: order.status,
    });

    // Fire server-side CAPI Purchase event
    try {
      const billing = orderData.billing || {};
      const capiUser: CAPIUserData = {
        email: billing.email,
        phone: billing.phone,
        firstName: billing.first_name,
        lastName: billing.last_name,
        city: billing.city,
        state: billing.state,
        zipCode: billing.postcode,
        country: billing.country || 'IN',
        clientIpAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '',
        clientUserAgent: request.headers.get('user-agent') || '',
      };

      const items = (orderData.line_items || []).map((li: LineItem) => ({
        id: li.product_id.toString(),
        quantity: li.quantity,
        price: parseFloat(li.total) / li.quantity,
      }));

      const total = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);

      trackCAPIPurchase(capiUser, items, total, String(order.id)).catch(() => {});
    } catch (capiErr) {
      console.warn('[WC-API] CAPI Purchase tracking failed:', capiErr);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[WC-API] Create order error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 }
    );
  }
}

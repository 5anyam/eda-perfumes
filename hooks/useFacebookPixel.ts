// hooks/useFacebookPixel.ts
'use client';

import { useCallback } from 'react';
import type { FacebookPixelParams, Product, CartItem } from '../lib/facebook-pixel';

// Helper: get _fbp and _fbc cookies for deduplication
function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};
  const cookies = document.cookie.split(';').reduce((acc, c) => {
    const [key, val] = c.trim().split('=');
    if (key && val) acc[key] = val;
    return acc;
  }, {} as Record<string, string>);
  return { fbp: cookies['_fbp'], fbc: cookies['_fbc'] };
}

// Send event to server-side CAPI (fire-and-forget)
function sendCAPI(eventName: string, eventId: string, userData: Record<string, string | undefined>, customData?: Record<string, unknown>) {
  fetch('/api/meta-capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: typeof window !== 'undefined' ? window.location.href : '',
      user_data: userData,
      custom_data: customData,
    }),
  }).catch(() => {}); // silent fail - don't block UI
}

function generateEventId(eventName: string): string {
  return `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useFacebookPixel = () => {
  const trackEvent = useCallback((eventName: string, parameters: FacebookPixelParams = {}, userData?: Record<string, string | undefined>) => {
    const eventId = generateEventId(eventName);
    const { fbp, fbc } = getMetaCookies();
    const mergedUserData = { ...userData, fbp, fbc };

    // Client-side pixel (with event_id for deduplication)
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters as Record<string, unknown>, { eventID: eventId });
    }

    // Server-side CAPI
    sendCAPI(eventName, eventId, mergedUserData, parameters as Record<string, unknown>);
  }, []);

  const trackViewContent = useCallback((product: Product) => {
    trackEvent('ViewContent', {
      content_ids: [product.id.toString()],
      content_name: product.name,
      content_type: 'product',
      value: parseFloat(product.price.toString()),
      currency: 'INR',
    });
  }, [trackEvent]);

  const trackAddToCart = useCallback((product: Product, quantity: number = 1) => {
    trackEvent('AddToCart', {
      content_ids: [product.id.toString()],
      content_name: product.name,
      content_type: 'product',
      value: parseFloat(product.price.toString()) * quantity,
      currency: 'INR',
      num_items: quantity,
    });
  }, [trackEvent]);

  const trackInitiateCheckout = useCallback((cartItems: CartItem[], total: number, userData?: { email?: string; phone?: string }) => {
    trackEvent('InitiateCheckout', {
      content_ids: cartItems.map(item => item.id.toString()),
      content_type: 'product',
      value: parseFloat(total.toString()),
      currency: 'INR',
      num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    }, userData as Record<string, string | undefined>);
  }, [trackEvent]);

  const trackAddPaymentInfo = useCallback((cartItems: CartItem[], total: number, userData?: { email?: string; phone?: string }) => {
    trackEvent('AddPaymentInfo', {
      content_ids: cartItems.map(item => item.id.toString()),
      content_type: 'product',
      value: parseFloat(total.toString()),
      currency: 'INR',
    }, userData as Record<string, string | undefined>);
  }, [trackEvent]);

  const trackPurchase = useCallback((orderItems: CartItem[], total: number, orderId: string, userData?: { email?: string; phone?: string; firstName?: string; lastName?: string; city?: string; state?: string; zipCode?: string }) => {
    trackEvent('Purchase', {
      content_ids: orderItems.map(item => item.id.toString()),
      content_name: 'EDA Perfumes Order',
      content_type: 'product',
      value: parseFloat(total.toString()),
      currency: 'INR',
      order_id: orderId,
      num_items: orderItems.reduce((sum, item) => sum + item.quantity, 0),
    }, userData as Record<string, string | undefined>);
  }, [trackEvent]);

  const trackContact = useCallback(() => {
    trackEvent('Contact');
  }, [trackEvent]);

  const trackSubscribe = useCallback((value?: number) => {
    trackEvent('Subscribe', value ? { value, currency: 'INR' } : {});
  }, [trackEvent]);

  const trackSearch = useCallback((searchString: string) => {
    trackEvent('Search', { content_name: searchString });
  }, [trackEvent]);

  const trackAddToWishlist = useCallback((product: Product) => {
    trackEvent('AddToWishlist', {
      content_ids: [product.id.toString()],
      content_name: product.name,
      content_type: 'product',
      value: parseFloat(product.price.toString()),
      currency: 'INR',
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackAddPaymentInfo,
    trackPurchase,
    trackContact,
    trackSubscribe,
    trackSearch,
    trackAddToWishlist,
  };
};

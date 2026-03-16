'use client';

import { useCart } from '../lib/cart';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function StickyCheckoutBar() {
  const { items, isCartLoaded, openDrawer } = useCart();
  const pathname = usePathname();

  // Hide on checkout, order-confirmation, cart pages
  const hiddenPaths = ['/checkout', '/order-confirmation', '/cart', '/payment-failed'];
  if (hiddenPaths.some(p => pathname.startsWith(p))) return null;
  if (!isCartLoaded || items.length === 0) return null;

  // On offer pages, only enable checkout when the offer bundle is complete (has free items in cart)
  const offerPaths = ['/eid-offers', '/buy-one-get-one-free', '/buy-two-get-free', '/buy-three-get-gifts'];
  const isOfferPage = offerPaths.some(p => pathname.startsWith(p));
  const hasCompletedOffer = items.some(item => parseFloat(item.price) === 0);
  const isCheckoutDisabled = isOfferPage && !hasCompletedOffer;

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] safe-area-bottom">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-[68px] gap-3">
          {/* Cart info - clickable to open drawer */}
          <button
            onClick={openDrawer}
            className="flex items-center gap-2 sm:gap-3 min-w-0"
          >
            <div className="relative flex-shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs text-gray-500 font-light hidden sm:block">
                {itemCount} item{itemCount > 1 ? 's' : ''} in cart
              </p>
              <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                ₹{subtotal.toLocaleString('en-IN')}
              </p>
            </div>
          </button>

          {/* Checkout button */}
          {isCheckoutDisabled ? (
            <span className="flex items-center gap-2 bg-gray-300 text-gray-500 px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold cursor-not-allowed">
              Complete Selection
            </span>
          ) : (
            <Link
              href="/checkout"
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

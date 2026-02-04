'use client';

import { useCart } from '../lib/cart';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, increment, decrement, removeFromCart, clear, isCartLoaded } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  // Close drawer when route changes (not on initial mount)
  useEffect(() => {
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      closeDrawer();
    }
    prevPathnameRef.current = pathname;
  }, [pathname, closeDrawer]);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + Number(item.regular_price || item.price) * item.quantity, 0);
  const discount = originalTotal - subtotal;

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              YOUR CART • {isCartLoaded ? items.length : '...'}
            </SheetTitle>
            {items.length > 0 && (
              <button
                onClick={clear}
                className="text-sm text-rose-500 hover:text-rose-600 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {!isCartLoaded ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm">Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
              <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm">Add some products to get started</p>
              <button
                onClick={closeDrawer}
                className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    {item.images?.[0]?.src ? (
                      <img
                        src={item.images[0].src}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="float-right text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 pr-6">
                      {item.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      {item.regular_price && Number(item.regular_price) > Number(item.price) && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{Number(item.regular_price).toLocaleString()}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{Number(item.price).toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => decrement(item.id)}
                          className="p-1.5 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => increment(item.id)}
                          className="p-1.5 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        = ₹{(Number(item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Frequently Bought Together - Placeholder */}
          {items.length > 0 && (
            <div className="p-4 bg-rose-50 mx-4 rounded-lg mb-4">
              <h4 className="text-sm font-semibold text-rose-700 mb-2">
                Frequently Bought Together
              </h4>
              <p className="text-xs text-rose-600">
                Check out our combo deals for better savings!
              </p>
              <Link
                href="/combos"
                onClick={closeDrawer}
                className="inline-block mt-2 text-xs font-medium text-rose-700 hover:text-rose-800 underline"
              >
                View Combos →
              </Link>
            </div>
          )}
        </div>

        {/* Footer - Coupon & Checkout */}
        {items.length > 0 && (
          <div className="border-t bg-white p-4 space-y-4">
            {/* Coupon Code */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="eg. Discount Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-semibold hover:bg-rose-600 transition-colors">
                APPLY
              </button>
            </div>

            {/* Price Summary */}
            <div className="space-y-2 text-sm">
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <div className="text-right">
                  {discount > 0 && (
                    <span className="text-gray-400 line-through mr-2">
                      ₹{originalTotal.toLocaleString()}
                    </span>
                  )}
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Checkout
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

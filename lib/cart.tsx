'use client';
import React, { useContext, createContext, useReducer, useEffect, useState, useCallback } from "react";

export type Product = {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  images: { src: string }[];
};

export type CartItem = Product & { quantity: number };
export type CartState = { items: CartItem[] };
export type CartAction =
  | { type: "add"; product: Product }
  | { type: "remove"; id: number }
  | { type: "increment"; id: number }
  | { type: "decrement"; id: number }
  | { type: "clear" }
  | { type: "load"; items: CartItem[] }; // load action

const CartContext = createContext<
  (CartState & {
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    increment: (id: number) => void;
    decrement: (id: number) => void;
    clear: () => void;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    isCartLoaded: boolean;
  }) | undefined
>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const exists = state.items.find((i) => i.id === action.product.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    case "remove": {
      const removedItem = state.items.find((i) => i.id === action.id);
      const filtered = state.items.filter((i) => i.id !== action.id);
      // If removing a paid item, trim free items to maintain balance
      if (removedItem && parseFloat(removedItem.price) > 0) {
        const remainingPaid = filtered.filter((i) => parseFloat(i.price) > 0);
        const remainingFree = filtered.filter((i) => parseFloat(i.price) === 0);
        if (remainingPaid.length === 0) {
          return { items: [] };
        }
        // Ensure total free qty does not exceed total paid qty
        const totalPaidQty = remainingPaid.reduce((sum, i) => sum + i.quantity, 0);
        const totalFreeQty = remainingFree.reduce((sum, i) => sum + i.quantity, 0);
        if (totalFreeQty > totalPaidQty) {
          let excess = totalFreeQty - totalPaidQty;
          const trimmedFree: CartItem[] = [];
          for (let i = remainingFree.length - 1; i >= 0; i--) {
            const freeItem = remainingFree[i];
            if (excess >= freeItem.quantity) {
              excess -= freeItem.quantity;
            } else if (excess > 0) {
              trimmedFree.unshift({ ...freeItem, quantity: freeItem.quantity - excess });
              excess = 0;
            } else {
              trimmedFree.unshift(freeItem);
            }
          }
          return { items: [...remainingPaid, ...trimmedFree] };
        }
      }
      return { items: filtered };
    }
    case "increment": {
      const targetItem = state.items.find((i) => i.id === action.id);
      if (!targetItem) return state;
      // Block incrementing free items directly
      if (parseFloat(targetItem.price) === 0) return state;
      // Check if cart has free items (offer bundle)
      const freeItems = state.items.filter((i) => parseFloat(i.price) === 0);
      const paidItems = state.items.filter((i) => parseFloat(i.price) > 0);
      if (freeItems.length > 0 && paidItems.length === 1) {
        // Buy 1 Get 1: sync free items with the single paid item
        return {
          items: state.items.map((i) => {
            if (i.id === action.id) return { ...i, quantity: i.quantity + 1 };
            if (parseFloat(i.price) === 0) return { ...i, quantity: i.quantity + 1 };
            return i;
          }),
        };
      }
      // Multi-paid offers (Buy 2, Buy 3) or no free items: only increment the target
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    case "decrement": {
      const decItem = state.items.find((i) => i.id === action.id);
      if (!decItem) return state;
      // Block decrementing free items directly
      if (parseFloat(decItem.price) === 0) return state;
      const freeItemsDec = state.items.filter((i) => parseFloat(i.price) === 0);
      const paidItemsDec = state.items.filter((i) => parseFloat(i.price) > 0);
      if (freeItemsDec.length > 0 && paidItemsDec.length === 1) {
        // Buy 1 Get 1: sync free items with the single paid item
        return {
          items: state.items
            .map((i) => {
              if (i.id === action.id) return { ...i, quantity: Math.max(i.quantity - 1, 1) };
              if (parseFloat(i.price) === 0) return { ...i, quantity: Math.max(i.quantity - 1, 1) };
              return i;
            })
            .filter((i) => i.quantity > 0),
        };
      }
      // Multi-paid offers or no free items: only decrement the target
      return {
        items: state.items
          .map((i) =>
            i.id === action.id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
          )
          .filter((i) => i.quantity > 0),
      };
    }
    case "clear":
      return { items: [] };
    case "load":
      return { items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      dispatch({ type: "load", items: JSON.parse(stored) });
    }
    setIsCartLoaded(true);
  }, []);

  // Auto-remove free items if no paid items remain
  useEffect(() => {
    const paidItems = state.items.filter((i) => parseFloat(i.price) > 0);
    const freeItems = state.items.filter((i) => parseFloat(i.price) === 0);
    if (paidItems.length === 0 && freeItems.length > 0) {
      dispatch({ type: "clear" });
    }
  }, [state.items]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product: Product) => dispatch({ type: "add", product });
  const removeFromCart = (id: number) => dispatch({ type: "remove", id });
  const increment = (id: number) => dispatch({ type: "increment", id });
  const decrement = (id: number) => dispatch({ type: "decrement", id });
  const clear = () => dispatch({ type: "clear" });
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        increment,
        decrement,
        clear,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        isCartLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

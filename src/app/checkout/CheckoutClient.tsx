"use client";

import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../lib/cart";
import { toast } from "../../../hooks/use-toast";
import { useFacebookPixel } from "../../../hooks/useFacebookPixel";
import type { CartItem } from "../../../lib/facebook-pixel";
import Script from "next/script";
import { Gift, ChevronDown, ChevronUp, ShieldCheck, Truck, Lock, Package } from "lucide-react";

const RAZORPAY_CONFIG = {
  KEY_ID: "rzp_live_ROhFH4ehWnRMKy",
  COMPANY_NAME: "EDA Perfumes",
  THEME_COLOR: "#000000"
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  notes: string;
}

interface WooCommerceOrder {
  id: number;
  order_key: string;
  status: string;
  total: string;
  payment_url?: string;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
    code?: string;
    metadata?: Record<string, string>;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  retry?: {
    enabled: boolean;
    max_count?: number;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: RazorpayFailureResponse) => void) => void;
    };
  }
}

const createWooCommerceOrder = async (orderData: Record<string, unknown>): Promise<WooCommerceOrder> => {
  const response = await fetch('/api/woocommerce/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }

    let errorMessage = `Order creation failed: ${response.status}`;
    if (response.status === 404) {
      errorMessage = 'Order API not found. Please contact support.';
    } else if (typeof errorData === 'object' && errorData && errorData !== null && 'error' in errorData) {
      const typedError = errorData as { error: string };
      errorMessage = typedError.error;
    }

    throw new Error(errorMessage);
  }

  const order = await response.json();
  return order as WooCommerceOrder;
};

const updateWooCommerceOrderStatus = async (orderId: number, status: string, paymentData?: RazorpayHandlerResponse): Promise<WooCommerceOrder> => {
  const updateData: Record<string, unknown> = { status };

  if (paymentData) {
    updateData.meta_data = [
      { key: 'razorpay_payment_id', value: paymentData.razorpay_payment_id },
      { key: 'razorpay_order_id', value: paymentData.razorpay_order_id },
      { key: 'razorpay_signature', value: paymentData.razorpay_signature },
      { key: 'payment_method', value: 'razorpay' },
      { key: 'payment_captured_at', value: new Date().toISOString() },
    ];
  }

  const response = await fetch('/api/woocommerce/update-order', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, updateData }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update order: ${errorText}`);
  }

  const result = await response.json();
  return result as WooCommerceOrder;
};

export default function Checkout(): React.ReactElement {
  const { items, clear } = useCart();
  const router = useRouter();
  const { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } = useFacebookPixel();

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  const deliveryRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  // Simple pricing calculation - no bulk discounts
  const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const deliveryCharges = total >= 500 ? 0 : 50;

  // Calculate total free gifts (1 x 10ml perfume per bottle) — only for regular orders
  const hasOfferItemsEarly = items.some(item => parseFloat(item.price) === 0);
  const totalFreeGifts = hasOfferItemsEarly ? 0 : items.reduce((sum, item) => sum + item.quantity, 0);

  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);

  const hasOfferItems = items.some(item => parseFloat(item.price) === 0);
  const subtotalAfterCoupon = total - (hasOfferItems ? 0 : couponDiscount);
  const finalTotal = subtotalAfterCoupon + deliveryCharges;

  // Validate cart integrity for offer bundles
  const validateCartIntegrity = (): { valid: boolean; error: string } => {
    const paidItems = items.filter(item => parseFloat(item.price) > 0);
    const freeItems = items.filter(item => parseFloat(item.price) === 0);

    if (freeItems.length === 0) return { valid: true, error: '' };

    const totalPaidQty = paidItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalFreeQty = freeItems.reduce((sum, i) => sum + i.quantity, 0);
    if (totalFreeQty > totalPaidQty * freeItems.length) {
      return { valid: false, error: 'Cart has invalid free item quantities. Please clear cart and re-add from offer page.' };
    }

    if (paidItems.length === 0 && freeItems.length > 0) {
      return { valid: false, error: 'Free gifts require at least one paid item.' };
    }

    const paidTotal = paidItems.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
    const validOfferTotals = [399, 499, 899, 1099, 1299];
    const isOfferPrice = validOfferTotals.some(t => Math.abs(paidTotal - t) < 1);
    const isMultipleOfOffer = validOfferTotals.some(t => paidTotal > 0 && Math.abs(paidTotal % t) < 1);

    if (!isOfferPrice && !isMultipleOfOffer) {
      if (freeItems.length > 0 && paidTotal < 399) {
        return { valid: false, error: 'Invalid offer bundle. Please re-add items from the offer page.' };
      }
    }

    return { valid: true, error: '' };
  };

  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", whatsapp: "", address: "",
    pincode: "", city: "", state: "", notes: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<"form" | "processing">("form");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setRazorpayLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const cartItems: CartItem[] = items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity
      }));
      trackInitiateCheckout(cartItems, finalTotal);
    }
  }, [items, finalTotal, trackInitiateCheckout]);

  const validateCoupon = (code: string): { valid: boolean; discount: number; message: string } => {
    const upperCode = code.toUpperCase().trim();

    const validCoupons = [
      "AMAAN10", "ANJALI10", "VISHAL10", "PRATIKSHA10", "SONAKSHI10",
      "NANDANI10", "ISHITA10", "SHRISHTI10", "POORVA10", "MUSKAN10", "ARUNA10"
    ];

    if (validCoupons.includes(upperCode)) {
      return {
        valid: true,
        discount: Math.round(total * 0.1),
        message: "10% discount applied"
      };
    }

    return { valid: false, discount: 0, message: "Invalid coupon code" };
  };

  const handleApplyCoupon = (): void => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    if (appliedCoupon === couponCode.toUpperCase()) {
      setCouponError("Coupon already applied");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    setTimeout(() => {
      const validation = validateCoupon(couponCode);
      if (validation.valid) {
        setAppliedCoupon(couponCode.toUpperCase());
        setCouponDiscount(validation.discount);
        setCouponError("");
        toast({
          title: "Coupon Applied",
          description: `You saved ₹${validation.discount}`,
        });
      } else {
        setCouponError(validation.message);
        setAppliedCoupon("");
        setCouponDiscount(0);
      }
      setIsApplyingCoupon(false);
    }, 800);
  };

  const handleRemoveCoupon = (): void => {
    setAppliedCoupon("");
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
    toast({
      title: "Coupon Removed",
      description: "Coupon discount has been removed",
    });
  };

  function validateForm(): boolean {
    const newErrors: Partial<FormData> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!form.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required";
    if (!/^[0-9]{10}$/.test(form.whatsapp)) {
      newErrors.whatsapp = "Please enter a valid 10-digit WhatsApp number";
    }
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!/^[0-9]{6}$/.test(form.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";

    const isValid = Object.keys(newErrors).length === 0;

    if (isValid && items.length > 0) {
      const cartItems: CartItem[] = items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity
      }));
      trackAddPaymentInfo(cartItems, finalTotal);
    }

    setErrors(newErrors);
    return isValid;
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  function copyPhoneToWhatsApp(): void {
    if (form.phone) {
      setForm(f => ({ ...f, whatsapp: form.phone }));
      if (errors.whatsapp) {
        setErrors(prev => ({ ...prev, whatsapp: undefined }));
      }
    }
  }

  const handleCODSubmit = async (): Promise<void> => {
    const cartCheck = validateCartIntegrity();
    if (!cartCheck.valid) {
      toast({ title: "Invalid Cart", description: cartCheck.error, variant: "destructive" });
      return;
    }
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check all required fields",
        variant: "destructive",
      });
      // Scroll to delivery section if errors
      deliveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setLoading(true);
    setStep("processing");

    try {
      const fullAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;
      const orderData = {
        payment_method: 'cod',
        payment_method_title: 'Cash on Delivery (COD)',
        status: 'processing',
        billing: {
          first_name: form.name,
          last_name: '',
          address_1: form.address,
          address_2: '',
          city: form.city,
          state: form.state,
          postcode: form.pincode,
          country: 'IN',
          email: form.email,
          phone: form.phone,
        },
        shipping: {
          first_name: form.name,
          last_name: '',
          address_1: form.address,
          address_2: '',
          city: form.city,
          state: form.state,
          postcode: form.pincode,
          country: 'IN',
        },
        line_items: items.map((item) => ({
          product_id: Math.abs(parseInt(String(item.id), 10)),
          quantity: item.quantity,
          subtotal: (parseFloat(item.price) * item.quantity).toFixed(2),
          total: (parseFloat(item.price) * item.quantity).toFixed(2),
        })),
        shipping_lines: deliveryCharges > 0 ? [{
          method_id: 'flat_rate',
          method_title: 'Premium Delivery',
          total: deliveryCharges.toString(),
        }] : [],
        coupon_lines: appliedCoupon ? [{
          code: appliedCoupon.toLowerCase(),
          discount: couponDiscount.toString(),
        }] : [],
        customer_note: form.notes + (form.notes ? '\n\n' : '') +
          `WhatsApp: ${form.whatsapp}\n` +
          `Full Address: ${fullAddress}\n` +
          (totalFreeGifts > 0 ? `FREE GIFT: ${totalFreeGifts} x 10ml perfume${totalFreeGifts > 1 ? 's' : ''}` : 'Offer bundle order') +
          (appliedCoupon ? `\nCoupon Applied: ${appliedCoupon} (₹${couponDiscount} discount)` : ''),
        meta_data: [
          { key: 'whatsapp_number', value: form.whatsapp },
          { key: 'full_address', value: fullAddress },
          { key: 'subtotal', value: total.toString() },
          { key: 'delivery_charges', value: deliveryCharges.toString() },
          { key: 'final_total', value: finalTotal.toString() },
          { key: 'free_gifts', value: totalFreeGifts > 0 ? `${totalFreeGifts} x 10ml perfume` : 'Included in offer bundle' },
          { key: 'payment_method', value: 'cod' },
          ...(appliedCoupon ? [
            { key: 'coupon_code', value: appliedCoupon },
            { key: 'coupon_discount', value: couponDiscount.toString() }
          ] : []),
        ],
      };

      const wooOrder = await createWooCommerceOrder(orderData);

      const orderItems: CartItem[] = items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity
      }));
      trackPurchase(orderItems, finalTotal, String(wooOrder.id), {
        email: form.email,
        phone: form.phone,
        firstName: form.name.split(' ')[0],
        lastName: form.name.split(' ').slice(1).join(' '),
        city: form.city,
        state: form.state,
        zipCode: form.pincode,
      });

      clear();

      toast({
        title: "Order Placed Successfully!",
        description: `Order #${wooOrder.id} confirmed. Pay cash on delivery.`,
      });

      setTimeout(() => {
        router.push(`/order-confirmation?wcOrderId=${wooOrder.id}&cod=true`);
      }, 1000);

    } catch (error) {
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setStep("form");
    }
  };

  const handlePaymentSuccess = async (wooOrder: WooCommerceOrder, response: RazorpayHandlerResponse): Promise<void> => {
    try {
      await updateWooCommerceOrderStatus(wooOrder.id, 'processing', response);

      const orderItems: CartItem[] = items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity
      }));
      trackPurchase(orderItems, finalTotal, response.razorpay_payment_id, {
        email: form.email,
        phone: form.phone,
        firstName: form.name.split(' ')[0],
        lastName: form.name.split(' ').slice(1).join(' '),
        city: form.city,
        state: form.state,
        zipCode: form.pincode,
      });

      clear();

      toast({
        title: "Payment Successful",
        description: `Order #${wooOrder.id} confirmed. Redirecting...`,
      });

      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${response.razorpay_payment_id}&wcOrderId=${wooOrder.id}`);
      }, 1000);

    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Payment Completed",
        description: "Your payment was successful. We'll contact you soon.",
      });

      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${response.razorpay_payment_id}&wcOrderId=${wooOrder.id}`);
      }, 2000);
    } finally {
      setLoading(false);
      setStep("form");
    }
  };

  const handlePaymentFailure = async (wooOrder: WooCommerceOrder | null, response: RazorpayFailureResponse): Promise<void> => {
    if (wooOrder?.id) {
      try {
        await updateWooCommerceOrderStatus(wooOrder.id, 'failed');
      } catch {
        // Silently handle error
      }
    }

    const errorMessage = response?.error?.description || "Payment was not successful";

    toast({
      title: "Payment Failed",
      description: errorMessage,
      variant: "destructive",
    });

    setLoading(false);
    setStep("form");

    setTimeout(() => {
      const params = new URLSearchParams({
        error: errorMessage,
        ...(wooOrder?.id && { wcOrderId: wooOrder.id.toString() }),
        amount: finalTotal.toFixed(2)
      });
      router.push(`/payment-failed?${params.toString()}`);
    }, 1500);
  };

  const handlePaymentDismiss = async (wooOrder: WooCommerceOrder | null): Promise<void> => {
    if (wooOrder?.id) {
      try {
        await updateWooCommerceOrderStatus(wooOrder.id, 'cancelled');
      } catch {
        // Silently handle error
      }
    }

    toast({
      title: "Payment Cancelled",
      description: "You cancelled the payment process",
      variant: "destructive",
    });

    setLoading(false);
    setStep("form");

    setTimeout(() => {
      const params = new URLSearchParams({
        error: "Payment was cancelled by user",
        ...(wooOrder?.id && { wcOrderId: wooOrder.id.toString() }),
        amount: finalTotal.toFixed(2)
      });
      router.push(`/payment-failed?${params.toString()}`);
    }, 1500);
  };

  async function handleCheckout(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (paymentMethod === 'cod') {
      handleCODSubmit();
      return;
    }

    let wooOrder: WooCommerceOrder | null = null;

    try {
      if (!razorpayLoaded || typeof window === 'undefined' || !window.Razorpay) {
        toast({
          title: "Payment System Loading",
          description: "Please wait for payment system to load",
          variant: "destructive",
        });
        return;
      }

      const cartCheck = validateCartIntegrity();
      if (!cartCheck.valid) {
        toast({ title: "Invalid Cart", description: cartCheck.error, variant: "destructive" });
        return;
      }

      if (!validateForm()) {
        toast({
          title: "Please fix the errors",
          description: "Check all required fields",
          variant: "destructive",
        });
        deliveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      setLoading(true);
      setStep("processing");

      const fullAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

      const orderData = {
        payment_method: 'razorpay',
        payment_method_title: 'Razorpay (Credit Card/Debit Card/NetBanking/UPI)',
        status: 'pending',
        billing: {
          first_name: form.name,
          last_name: '',
          address_1: form.address,
          address_2: '',
          city: form.city,
          state: form.state,
          postcode: form.pincode,
          country: 'IN',
          email: form.email,
          phone: form.phone,
        },
        shipping: {
          first_name: form.name,
          last_name: '',
          address_1: form.address,
          address_2: '',
          city: form.city,
          state: form.state,
          postcode: form.pincode,
          country: 'IN',
        },
        line_items: items.map((item) => ({
          product_id: Math.abs(parseInt(String(item.id), 10)),
          quantity: item.quantity,
          subtotal: (parseFloat(item.price) * item.quantity).toFixed(2),
          total: (parseFloat(item.price) * item.quantity).toFixed(2),
        })),
        shipping_lines: deliveryCharges > 0 ? [{
          method_id: 'flat_rate',
          method_title: 'Premium Delivery',
          total: deliveryCharges.toString(),
        }] : [],
        coupon_lines: appliedCoupon ? [{
          code: appliedCoupon.toLowerCase(),
          discount: couponDiscount.toString(),
        }] : [],
        customer_note: form.notes + (form.notes ? '\n\n' : '') +
          `WhatsApp: ${form.whatsapp}\n` +
          `Full Address: ${fullAddress}\n` +
          (totalFreeGifts > 0 ? `FREE GIFT: ${totalFreeGifts} x 10ml perfume${totalFreeGifts > 1 ? 's' : ''}` : 'Offer bundle order') +
          (appliedCoupon ? `\nCoupon Applied: ${appliedCoupon} (₹${couponDiscount} discount)` : ''),
        meta_data: [
          { key: 'whatsapp_number', value: form.whatsapp },
          { key: 'full_address', value: fullAddress },
          { key: 'subtotal', value: total.toString() },
          { key: 'delivery_charges', value: deliveryCharges.toString() },
          { key: 'final_total', value: finalTotal.toString() },
          { key: 'free_gifts', value: totalFreeGifts > 0 ? `${totalFreeGifts} x 10ml perfume` : 'Included in offer bundle' },
          ...(appliedCoupon ? [
            { key: 'coupon_code', value: appliedCoupon },
            { key: 'coupon_discount', value: couponDiscount.toString() }
          ] : []),
        ],
      };

      wooOrder = await createWooCommerceOrder(orderData);

      const razorpayOptions: RazorpayOptions = {
        key: RAZORPAY_CONFIG.KEY_ID,
        amount: Math.round(finalTotal * 100),
        currency: "INR",
        name: RAZORPAY_CONFIG.COMPANY_NAME,
        description: `Order #${wooOrder.id}`,
        handler: (response: RazorpayHandlerResponse) => {
          handlePaymentSuccess(wooOrder!, response);
        },
        modal: {
          ondismiss: () => {
            handlePaymentDismiss(wooOrder);
          },
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },
        theme: {
          color: RAZORPAY_CONFIG.THEME_COLOR
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      const rzp = new window.Razorpay(razorpayOptions);

      rzp.on('payment.failed', (response: RazorpayFailureResponse) => {
        handlePaymentFailure(wooOrder, response);
      });

      rzp.open();
      setLoading(false);

    } catch (err) {
      if (wooOrder?.id) {
        try {
          await updateWooCommerceOrderStatus(wooOrder.id, 'cancelled');
        } catch {
          // Silently handle cancellation error
        }
      }

      toast({
        title: "Checkout Failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
      setLoading(false);
      setStep("form");
    }
  }

  // Check which sections are filled
  const isDeliveryFilled = form.name && form.email && form.phone && form.whatsapp && form.address && form.pincode && form.city && form.state;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-lg mx-auto text-center py-24 px-4">
          <div className="border border-gray-200 p-12">
            <h2 className="text-2xl font-light text-gray-900 mb-3 tracking-wide">Your Cart is Empty</h2>
            <p className="text-gray-600 text-sm mb-8 font-light">Add items to get started</p>
            <button
              onClick={() => router.push("/")}
              className="inline-block px-8 py-3 text-xs text-white bg-black hover:bg-gray-800 transition-colors tracking-widest uppercase font-light"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          toast({
            title: "Payment System Error",
            description: "Failed to load payment system. Please refresh the page.",
            variant: "destructive",
          });
        }}
      />

      <div className="min-h-screen bg-gray-50 pb-32 lg:pb-10">
        {/* Step Progress Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-medium">1</div>
                <span className="text-xs font-medium text-gray-900 hidden sm:inline">Cart</span>
              </div>
              <div className="w-6 sm:w-10 h-px bg-gray-300" />
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${isDeliveryFilled ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
                <span className={`text-xs hidden sm:inline ${isDeliveryFilled ? 'font-medium text-gray-900' : 'text-gray-500'}`}>Details</span>
              </div>
              <div className="w-6 sm:w-10 h-px bg-gray-300" />
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-medium">3</div>
                <span className="text-xs text-gray-500 hidden sm:inline">Payment</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="max-w-5xl mx-auto px-4 py-6 lg:py-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            {/* Left Column — Form sections */}
            <div className="lg:col-span-3 space-y-4">

              {/* Section 1: Order Summary (collapsible on mobile, always open on desktop) */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
                  className="w-full flex items-center justify-between p-4 lg:hidden"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Order Summary ({items.length} item{items.length > 1 ? 's' : ''})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">₹{finalTotal.toFixed(0)}</span>
                    {orderSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <div className={`${orderSummaryOpen ? 'block' : 'hidden'} lg:block`}>
                  <div className="p-4 pt-0 lg:pt-4">
                    <div className="hidden lg:flex items-center gap-2 mb-4">
                      <Package className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Order Summary</span>
                    </div>

                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-gray-900 block truncate">{item.name}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                              {!hasOfferItems && parseFloat(item.price) > 0 && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                                  <Gift className="w-3 h-3" />
                                  +{item.quantity} FREE 10ml
                                </span>
                              )}
                              {parseFloat(item.price) === 0 && (
                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">FREE</span>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 ml-4">
                            ₹{((hasOfferItems && item.regular_price && parseFloat(item.regular_price) > 0 ? parseFloat(item.regular_price) : parseFloat(item.price)) * item.quantity).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Code (only for non-offer orders) */}
              {!hasOfferItems && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md focus:border-black focus:outline-none text-sm text-gray-900"
                      disabled={!!appliedCoupon}
                    />
                    <button
                      type="button"
                      onClick={appliedCoupon ? handleRemoveCoupon : handleApplyCoupon}
                      disabled={isApplyingCoupon}
                      className={`px-5 py-2.5 text-xs font-medium tracking-wider uppercase rounded-md transition-colors ${
                        appliedCoupon
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                          : 'bg-black hover:bg-gray-800 text-white'
                      } ${isApplyingCoupon ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {isApplyingCoupon ? 'Applying...' : appliedCoupon ? 'Remove' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
                  {appliedCoupon && <p className="text-emerald-600 text-xs mt-1.5">Coupon {appliedCoupon} applied — you save ₹{couponDiscount}</p>}
                </div>
              )}

              {/* Section 2: Delivery Information */}
              <div ref={deliveryRef} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <h2 className="text-sm font-medium text-gray-900">Delivery Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">Full Name *</label>
                    <input
                      name="name"
                      required
                      className={`w-full px-3 py-2.5 border rounded-md text-sm text-gray-900 transition-colors focus:outline-none ${
                        errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="Full name"
                      value={form.name}
                      onChange={onChange}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">Email *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className={`w-full px-3 py-2.5 border rounded-md text-sm text-gray-900 transition-colors focus:outline-none ${
                        errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={onChange}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">Phone *</label>
                    <input
                      name="phone"
                      type="tel"
                      pattern="[0-9]{10}"
                      required
                      className={`w-full px-3 py-2.5 border rounded-md text-sm text-gray-900 transition-colors focus:outline-none ${
                        errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="10-digit number"
                      value={form.phone}
                      onChange={onChange}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      WhatsApp *
                      <button
                        type="button"
                        onClick={copyPhoneToWhatsApp}
                        className="ml-2 text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded hover:bg-gray-700 transition-colors"
                      >
                        Same as phone
                      </button>
                    </label>
                    <input
                      name="whatsapp"
                      type="tel"
                      pattern="[0-9]{10}"
                      required
                      className={`w-full px-3 py-2.5 border rounded-md text-sm text-gray-900 transition-colors focus:outline-none ${
                        errors.whatsapp ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="WhatsApp number"
                      value={form.whatsapp}
                      onChange={onChange}
                    />
                    {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-1.5">Address *</label>
                  <textarea
                    name="address"
                    rows={2}
                    required
                    className={`w-full px-3 py-2.5 border rounded-md text-sm text-gray-900 transition-colors focus:outline-none resize-none ${
                      errors.address ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                    }`}
                    placeholder="House no., Street, Landmark"
                    value={form.address}
                    onChange={onChange}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">Pincode *</label>
                    <input
                      name="pincode"
                      type="text"
                      pattern="[0-9]{6}"
                      required
                      className={`w-full px-3 py-2.5 border rounded-md text-sm text-gray-900 transition-colors focus:outline-none ${
                        errors.pincode ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="6-digit"
                      value={form.pincode}
                      onChange={onChange}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">City *</label>
                    <input
                      name="city"
                      required
                      className={`w-full px-3 py-2.5 border rounded-md text-sm text-gray-900 transition-colors focus:outline-none ${
                        errors.city ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                      }`}
                      placeholder="City"
                      value={form.city}
                      onChange={onChange}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">State *</label>
                    <select
                      name="state"
                      required
                      className={`w-full px-3 py-2.5 border rounded-md text-sm text-gray-900 transition-colors focus:outline-none ${
                        errors.state ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                      }`}
                      value={form.state}
                      onChange={onChange}
                    >
                      <option value="">Select</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Assam">Assam</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                      <option value="Goa">Goa</option>
                    </select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Order Notes (optional)</label>
                  <textarea
                    name="notes"
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:border-black focus:outline-none transition-colors text-sm text-gray-900 resize-none"
                    placeholder="Special instructions"
                    value={form.notes}
                    onChange={onChange}
                  />
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div ref={paymentRef} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-gray-600" />
                  <h2 className="text-sm font-medium text-gray-900">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    className="p-3 sm:p-4 border rounded-lg text-center transition-all border-black bg-gray-950 text-white ring-1 ring-black"
                  >
                    <span className="text-xs sm:text-sm font-medium block">Online Payment</span>
                    <span className="text-[10px] sm:text-xs opacity-70 block mt-0.5">UPI / Card / NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Place Order Button — visible on desktop in left column */}
              <div className="hidden lg:block">
                <button
                  type="submit"
                  className={`w-full bg-black hover:bg-gray-800 text-white py-4 rounded-lg text-sm font-medium tracking-wide transition-colors ${
                    loading || step === "processing" || (paymentMethod === 'razorpay' && !razorpayLoaded)
                      ? "opacity-60 pointer-events-none"
                      : ""
                  }`}
                  disabled={loading || step === "processing" || (paymentMethod === 'razorpay' && !razorpayLoaded)}
                >
                  {loading || step === "processing" ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : paymentMethod === 'razorpay' && !razorpayLoaded ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading Payment...
                    </div>
                  ) : (
                    `Pay ₹${finalTotal.toFixed(0)}`
                  )}
                </button>

                {step === "processing" && (
                  <p className="text-center text-gray-500 text-xs mt-2">
                    Creating order and processing payment...
                  </p>
                )}

                <div className="flex items-center justify-center gap-4 mt-4 text-gray-400 text-xs">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL Secured</span>
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Encrypted</span>
                  <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column — Sticky Order Total (desktop only) */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-16">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Price Details</h3>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                      <span>₹{total.toFixed(0)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Coupon ({appliedCoupon})</span>
                        <span>-₹{couponDiscount.toFixed(0)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span className={deliveryCharges === 0 ? 'text-emerald-600' : ''}>
                        {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
                      </span>
                    </div>

                    {!hasOfferItems && totalFreeGifts > 0 && (
                      <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-md text-xs">
                        <Gift className="w-3.5 h-3.5" />
                        <span>{totalFreeGifts} FREE 10ml perfume{totalFreeGifts > 1 ? 's' : ''} included</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total</span>
                      <div className="text-right">
                        <span className="text-xl font-semibold text-gray-900">₹{finalTotal.toFixed(0)}</span>
                        {couponDiscount > 0 && (
                          <p className="text-xs text-emerald-600 mt-0.5">You save ₹{couponDiscount}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Mobile Sticky Bottom Bar — Place Order */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 lg:hidden z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-lg font-semibold text-gray-900">₹{finalTotal.toFixed(0)}</div>
              <div className="text-[10px] text-gray-500">
                {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''}
                {couponDiscount > 0 && ` · Save ₹${couponDiscount}`}
              </div>
            </div>
            <button
              type="submit"
              form="checkout-form-id"
              onClick={(e) => {
                e.preventDefault();
                const formEl = document.querySelector('form') as HTMLFormElement;
                if (formEl) formEl.requestSubmit();
              }}
              className={`px-6 py-3 bg-black text-white rounded-lg text-sm font-medium transition-colors ${
                loading || step === "processing" || (paymentMethod === 'razorpay' && !razorpayLoaded)
                  ? "opacity-60 pointer-events-none"
                  : "hover:bg-gray-800"
              }`}
              disabled={loading || step === "processing" || (paymentMethod === 'razorpay' && !razorpayLoaded)}
            >
              {loading || step === "processing" ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></span>
                  Processing
                </span>
              ) : (
                `Pay ₹${finalTotal.toFixed(0)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

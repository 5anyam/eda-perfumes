import { Metadata } from 'next';
import OrderConfirmationClient from './OrderConfirmationClient';

export const metadata: Metadata = {
  title: 'Order Confirmed | EDA Perfumes',
  description: 'Your order has been confirmed at EDA Perfumes.',
  alternates: { canonical: 'https://www.edaperfumes.com/order-confirmation' },
  robots: { index: false, follow: false },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function OrderConfirmationPage() {
  return <OrderConfirmationClient />;
}

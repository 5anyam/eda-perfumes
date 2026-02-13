import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout | EDA Perfumes',
  description: 'Complete your purchase securely at EDA Perfumes.',
  alternates: { canonical: 'https://www.edaperfumes.com/checkout' },
  robots: { index: false, follow: false },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

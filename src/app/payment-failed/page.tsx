import { Metadata } from 'next';
import PaymentFailedClient from './PaymentFailedClient';

export const metadata: Metadata = {
  title: 'Payment Failed | EDA Perfumes',
  description: 'Your payment could not be processed. Please try again.',
  alternates: { canonical: 'https://www.edaperfumes.com/payment-failed' },
  robots: { index: false, follow: false },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function PaymentFailedPage() {
  return <PaymentFailedClient />;
}

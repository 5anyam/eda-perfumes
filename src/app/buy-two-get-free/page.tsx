import { Metadata } from 'next';
import BuyTwoGetFreeClient from './BuyTwoGetFreeClient';

export const metadata: Metadata = {
  title: "Buy 2 @ ₹899 + Get 4×10ml FREE | Eda Perfumes",
  description: "Exclusive offer - Buy any 2 signature perfumes at just ₹899 and get 4 travel size 10ml perfumes absolutely FREE! Limited time offer at Eda Perfumes.",
  keywords: "perfume offer, buy 2 get free, eda perfumes, fragrance deal, perfume discount",
  alternates: { canonical: 'https://www.edaperfumes.com/buy-two-get-free' },
  openGraph: {
    title: "Buy 2 @ ₹899 + Get 4×10ml FREE | Eda Perfumes",
    description: "Buy 2 Signature Perfumes @ ₹899 + Get 4 Travel Sizes FREE",
    type: "website",
    url: 'https://www.edaperfumes.com/buy-two-get-free',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BuyTwoGetFreePage() {
  return <BuyTwoGetFreeClient />;
}

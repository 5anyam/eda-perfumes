import { Metadata } from 'next';
import BuyThreeGetGiftsClient from './BuyThreeGetGiftsClient';

export const metadata: Metadata = {
  title: "Buy 3 @ ₹1499 + Get 3 FREE Gifts | Eda Perfumes",
  description: "Ultimate perfume deal - Buy any 3 signature perfumes at just ₹1499 and get 3 travel size 10ml perfumes as FREE gifts! Best value offer at Eda Perfumes.",
  keywords: "perfume offer, buy 3 get gifts, eda perfumes, fragrance deal, perfume bundle, best perfume offer",
  alternates: { canonical: 'https://www.edaperfumes.com/buy-three-get-gifts' },
  openGraph: {
    title: "Buy 3 @ ₹1499 + Get 3 FREE Gifts | Eda Perfumes",
    description: "Buy 3 Signature Perfumes @ ₹1499 + Get 3 Travel Sizes FREE",
    type: "website",
    url: 'https://www.edaperfumes.com/buy-three-get-gifts',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BuyThreeGetGiftsPage() {
  return <BuyThreeGetGiftsClient />;
}

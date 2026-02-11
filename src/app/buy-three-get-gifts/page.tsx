import { Metadata } from 'next';
import BuyThreeGetGiftsClient from './BuyThreeGetGiftsClient';

///
export const metadata: Metadata = {
  title: "Buy 3 @ ₹1499 + Get 3 FREE Gifts | Eda Perfumes",
  description: "Ultimate perfume deal - Buy any 3 signature perfumes at just ₹1499 and get 3 travel size 10ml perfumes as FREE gifts! Best value offer at Eda Perfumes.",
  keywords: "perfume offer, buy 3 get gifts, eda perfumes, fragrance deal, perfume bundle, best perfume offer",
  openGraph: {
    title: "Buy 3 @ ₹1499 + Get 3 FREE Gifts | Eda Perfumes",
    description: "Buy 3 Signature Perfumes @ ₹1499 + Get 3 Travel Sizes FREE",
    type: "website",
  },
};

export default function BuyThreeGetGiftsPage() {
  return <BuyThreeGetGiftsClient />;
}

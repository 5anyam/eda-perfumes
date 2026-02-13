import { Metadata } from 'next';
import BuyOneGetOneFreeClient from './BuyOneGetOneFreeClient';

export const metadata: Metadata = {
  title: "Buy 1 Get 1 FREE @ ₹799 | Eda Perfumes",
  description: "Buy any 100ml signature perfume and get a 10ml travel size FREE at just ₹799. Premium eau de parfum deal at Eda Perfumes.",
  keywords: "buy 1 get 1, perfume deal, eda perfumes, fragrance offer, perfume bundle, free perfume",
  alternates: { canonical: 'https://www.edaperfumes.com/buy-one-get-one-free' },
  openGraph: {
    title: "Buy 1 Get 1 FREE @ ₹799 | Eda Perfumes",
    description: "100ml Signature Perfume + FREE 10ml Travel Size @ ₹799",
    type: "website",
    url: 'https://www.edaperfumes.com/buy-one-get-one-free',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function BuyOneGetOneFreePage() {
  return <BuyOneGetOneFreeClient />;
}

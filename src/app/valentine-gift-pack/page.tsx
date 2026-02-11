import { Metadata } from 'next';
import ValentineGiftPackClient from './ValentineGiftPackClient';




export const metadata: Metadata = {
  title: "Valentine's Gift Pack - Buy 2 @₹999 & Get 2 10ml FREE | Eda Perfumes",
  description: "Exclusive Valentine's Day gift pack - Buy 2 signature 100ml perfumes at just ₹999 and get 2 travel size 10ml perfumes FREE. Perfect romantic gift for your loved ones.",
  keywords: "valentine gift, perfume gift pack, romantic gift, eda perfumes, fragrance gift set",
  openGraph: {
    title: "Valentine's Gift Pack - Eda Perfumes",
    description: "Buy 2 @₹999 & Get 2 10ml FREE - Limited Time Offer",
    type: "website",
  },
};

export default function ValentineGiftPackPage() {
  return <ValentineGiftPackClient />;
}

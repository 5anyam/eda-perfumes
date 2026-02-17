import { Metadata } from 'next';
import ValentineGiftPackClient from './ValentineGiftPackClient';

export const metadata: Metadata = {
  title: "Perfume Love Deal - Buy 2 @₹1099 & Get 4 Travel Size Perfumes FREE | Eda Perfumes",
  description: "Exclusive Perfume Love Deal - Buy any 2 signature 100ml perfumes at just ₹1099 and get 4 travel size perfumes (10ml) absolutely FREE. Perfect romantic gift for your loved ones.",
  keywords: "perfume love deal, valentine gift, perfume gift pack, romantic gift, eda perfumes, fragrance gift set, travel size perfumes free",
  alternates: { canonical: 'https://www.edaperfumes.com/valentine-gift-pack' },
  openGraph: {
    title: "Perfume Love Deal - Eda Perfumes",
    description: "Buy 2 @₹1099 & Get 4 Travel Size Perfumes FREE - Limited Time Offer",
    type: "website",
    url: 'https://www.edaperfumes.com/valentine-gift-pack',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function ValentineGiftPackPage() {
  return <ValentineGiftPackClient />;
}

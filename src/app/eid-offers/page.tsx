import { Metadata } from 'next';
import EidOffersClient from './EidOffersClient';

export const metadata: Metadata = {
  title: "Eid Special Offer @ ₹899 | Oudh Shukran + 100ml + 10ml FREE | Eda Perfumes",
  description: "Celebrate Eid with EDA Perfumes! Get Oudh Shukran 100ml + any 100ml perfume + any 10ml travel size perfume — all at just ₹899. Limited time Eid special offer.",
  keywords: "eid perfume offer, oudh shukran, eda perfumes, eid gift, perfume deal, ramadan offer",
  alternates: { canonical: 'https://www.edaperfumes.com/eid-offers' },
  openGraph: {
    title: "Eid Special Offer @ ₹899 | Oudh Shukran + 100ml + 10ml FREE | Eda Perfumes",
    description: "Eid Special - Oudh Shukran + Any 100ml + Any 10ml at just ₹899",
    type: "website",
    url: 'https://www.edaperfumes.com/eid-offers',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function EidOffersPage() {
  return <EidOffersClient />;
}

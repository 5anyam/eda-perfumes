import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms & Conditions | EDA Perfumes',
  description: 'Read the terms and conditions for using the EDA Perfumes website and purchasing our luxury fragrances.',
  alternates: { canonical: 'https://www.edaperfumes.com/terms-and-conditions' },
  openGraph: {
    title: 'Terms & Conditions | EDA Perfumes',
    description: 'Terms governing your luxury fragrance shopping experience at EDA Perfumes.',
    type: 'website',
    url: 'https://www.edaperfumes.com/terms-and-conditions',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function TermsPage() {
  return <TermsClient />;
}

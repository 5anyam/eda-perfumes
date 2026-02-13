import { Metadata } from 'next';
import DisclaimerClient from './DisclaimerClient';

export const metadata: Metadata = {
  title: 'Disclaimer | EDA Perfumes',
  description: 'Disclaimer for EDA Perfumes products and services.',
  alternates: { canonical: 'https://www.edaperfumes.com/disclaimer' },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function DisclaimerPage() {
  return <DisclaimerClient />;
}

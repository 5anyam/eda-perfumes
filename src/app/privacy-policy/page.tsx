import { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | EDA Perfumes',
  description: 'Read the EDA Perfumes privacy policy to understand how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://www.edaperfumes.com/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | EDA Perfumes',
    description: 'How EDA Perfumes protects your personal information.',
    type: 'website',
    url: 'https://www.edaperfumes.com/privacy-policy',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}

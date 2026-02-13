import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | EDA Perfumes',
  description: 'Get in touch with EDA Perfumes. Reach out for fragrance consultations, order inquiries, or any questions about our luxury perfume collection.',
  alternates: { canonical: 'https://www.edaperfumes.com/contact' },
  openGraph: {
    title: 'Contact Us | EDA Perfumes',
    description: 'Get in touch with EDA Perfumes for fragrance consultations and order inquiries.',
    type: 'website',
    url: 'https://www.edaperfumes.com/contact',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function ContactPage() {
  return <ContactClient />;
}

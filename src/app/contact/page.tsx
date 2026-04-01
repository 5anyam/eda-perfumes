import type { Metadata } from 'next';
import { fetchPageSeo } from '../../../lib/wordpress-blog';
import PageSchemas from '../../../components/PageSchemas';
import ContactClient from './ContactClient';

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await fetchPageSeo('contact');
  const title = yoast?.title || 'Contact Us | EDA Perfumes';
  const description = yoast?.description || 'Get in touch with EDA Perfumes. Reach out for fragrance consultations, order inquiries, or any questions about our luxury perfume collection.';
  const canonical = yoast?.canonical || 'https://www.edaperfumes.com/contact';
  return {
    title, description,
    alternates: { canonical },
    openGraph: {
      title: yoast?.og_title || title, description: yoast?.og_description || description,
      type: 'website', url: canonical,
      ...(yoast?.og_image?.[0]?.url && { images: [{ url: yoast.og_image[0].url }] }),
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://www.edaperfumes.com'),
  };
}

export default function ContactPage() {
  return <><PageSchemas slug="contact" /><ContactClient /></>;
}

import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login | EDA Perfumes',
  description: 'Sign in to your EDA Perfumes account.',
  alternates: { canonical: 'https://www.edaperfumes.com/login' },
  robots: { index: false, follow: false },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function LoginPage() {
  return <LoginClient />;
}

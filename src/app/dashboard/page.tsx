import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard | EDA Perfumes',
  description: 'Your EDA Perfumes account dashboard.',
  alternates: { canonical: 'https://www.edaperfumes.com/dashboard' },
  robots: { index: false, follow: false },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function DashboardPage() {
  return <DashboardClient />;
}

import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Shopping Cart | EDA Perfumes',
  description: 'Review your cart and proceed to checkout at EDA Perfumes.',
  alternates: { canonical: 'https://www.edaperfumes.com/cart' },
  robots: { index: false, follow: true },
  metadataBase: new URL('https://www.edaperfumes.com'),
};

export default function CartPage() {
  return <CartClient />;
}

'use client';

import React from 'react';
import Link from 'next/link';
import type { WPPage } from '../../../lib/wordpress-blog';
import ProductCard from '../../../components/ProductCard';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  images?: { src: string }[];
  categories?: { id: number; name: string; slug?: string }[];
  average_rating?: string;
  rating_count?: number;
}

interface Props {
  page: WPPage;
  products: Product[];
}

export default function WordPressPageContent({ page, products }: Props) {
  // Content is already cleaned by the server component
  const cleanContent = page.content;

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300">{page.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {page.title}
          </h1>
        </div>
      </div>

      {/* Page Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        {/* Featured Image */}
        {page.image && (
          <div className="mb-10 rounded-lg overflow-hidden">
            <img
              src={page.image}
              alt={page.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* WordPress Content */}
        {cleanContent && cleanContent.replace(/<[^>]+>/g, '').trim() !== '' && (
          <article
            className="prose prose-sm sm:prose-lg max-w-none text-gray-700 leading-7 sm:leading-8 mb-12
              prose-headings:text-gray-900 prose-headings:font-semibold
              prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
              prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:mb-4
              prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1
              prose-strong:text-gray-900
              prose-a:text-rose-600 prose-a:underline prose-a:decoration-rose-300 hover:prose-a:decoration-rose-500
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        )}

        {/* Product Grid */}
        {products.length > 0 && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

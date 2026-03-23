'use client';

import React from 'react';
import Link from 'next/link';
import type { WPPage } from '../../../lib/wordpress-blog';

interface Props {
  page: WPPage;
}

export default function WordPressPageContent({ page }: Props) {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-rose-50 py-8 sm:py-16 px-3 sm:px-8 md:px-20 lg:px-40">
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-8 lg:p-12 shadow-2xl rounded-2xl border border-gray-200">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{page.title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 mb-6 leading-tight">
          {page.title}
        </h1>

        {/* Featured Image */}
        {page.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={page.image}
              alt={page.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <article
          className="prose prose-sm sm:prose-lg max-w-none text-gray-700 leading-7 sm:leading-8 space-y-4 sm:space-y-6"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}

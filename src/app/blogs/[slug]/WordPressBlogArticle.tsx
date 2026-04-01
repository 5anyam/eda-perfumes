'use client';

import React from 'react';
import Link from 'next/link';

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
import type { BlogPost } from '../../../../lib/wordpress-blog';

interface Props {
  post: BlogPost;
}

export default function WordPressBlogArticle({ post }: Props) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-rose-50 py-8 sm:py-16 px-3 sm:px-8 md:px-20 lg:px-40">
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-8 lg:p-12 shadow-2xl rounded-2xl border border-gray-200">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blogs" className="text-rose-600">Blog</Link>
        </nav>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blogs/tagged/${slugify(tag)}`}
                className="inline-block bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-medium border border-rose-200 hover:bg-rose-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 mb-4 leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />

        {/* Date */}
        <p className="text-xs text-gray-400 font-light mb-6">{formattedDate}</p>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
            <img
              src={post.image}
              alt={post.title.replace(/<[^>]+>/g, '')}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Article Content from WordPress */}
        <article
          className="prose prose-sm sm:prose-lg max-w-none text-gray-700 leading-7 sm:leading-8
            prose-headings:text-gray-800 prose-headings:font-bold
            prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mb-3 prose-h2:mt-8
            prose-h3:text-lg prose-h3:sm:text-xl prose-h3:mb-2 prose-h3:mt-6
            prose-p:mb-4
            prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1
            prose-strong:text-gray-900
            prose-a:text-rose-600 prose-a:underline prose-a:decoration-rose-300 hover:prose-a:decoration-rose-500
            prose-img:rounded-xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/blogs"
            className="inline-block px-6 sm:px-8 py-3 text-sm sm:text-base bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-full hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            Explore Our Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}

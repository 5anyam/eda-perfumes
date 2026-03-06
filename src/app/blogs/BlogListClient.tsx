'use client';

import Link from 'next/link';

const BLOG_POSTS = [
  {
    title: 'Craft a Mysterious Persona Through the Power of Scent',
    slug: 'craft-a-mysterious-persona-through-scent',
    excerpt:
      'Discover how the right fragrance builds a mysterious persona. Explore the best perfume for men under 1000 and elegant woody floral perfumes for women.',
    image:
      'https://cms.edaperfumes.com/wp-content/uploads/2026/03/Woody-Floral-Perfumes-For-Women.jpeg',
    date: 'March 2026',
    tags: ['Best Perfume For Men Under 1000', 'Woody Floral Perfumes For Women'],
  },
  {
    title: 'How to Choose a Perfume Based on Your Personality',
    slug: 'how-to-choose-perfume-based-on-your-personality',
    excerpt:
      'Discover how to choose the perfect perfume based on your personality and Indian summer climate. Find the best summer fragrances for men with expert tips.',
    image:
      'https://cms.edaperfumes.com/wp-content/uploads/2026/03/best-summer-perfume-for-men-.jpeg',
    date: 'March 2026',
    tags: ['Best Summer Perfumes For Men', 'Top 10 Perfume Brands For Male In India'],
  },
  {
    title: 'The Art of Wearing a Seductive Fragrance with Confidence and Elegance',
    slug: 'art-of-wearing-seductive-fragrance-with-confidence',
    excerpt:
      'Master the art of seduction with luxury fragrances. Discover how oud and woody perfumes for men, elegantly presented in a luxury perfume box, can elevate your style and confidence.',
    image:
      'https://cms.edaperfumes.com/wp-content/uploads/2026/02/The-Art-of-Wearing-a-Seductive-Fragrance-with-Confidence-and-Elegance.jpeg',
    date: 'February 2026',
    tags: ['Luxury Perfume Box', 'Seductive Perfumes for Men'],
  },
];

export default function BlogListClient() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-rose-50 min-h-screen">
      {/* Hero Section */}
      <div className="pt-10 sm:pt-16 pb-6 sm:pb-10 text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-wide mb-3 sm:mb-4">
          Our Blog
        </h1>
        <div className="w-12 sm:w-16 h-px bg-gray-300 mx-auto mb-3 sm:mb-4" />
        <p className="text-xs sm:text-sm md:text-base text-gray-500 font-light max-w-xl mx-auto px-2">
          Expert fragrance tips, guides, and the art of wearing luxury scents with confidence.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-rose-50 text-rose-500 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border border-rose-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors duration-300">
                  {post.title}
                </h2>

                {/* Date */}
                <p className="text-[10px] sm:text-xs text-gray-400 font-light mb-2 sm:mb-3">{post.date}</p>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-gray-500 font-light line-clamp-3 mb-3 sm:mb-4">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <span className="text-xs sm:text-sm text-rose-500 font-medium group-hover:text-rose-600 transition-colors inline-flex items-center gap-1">
                  Read More
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

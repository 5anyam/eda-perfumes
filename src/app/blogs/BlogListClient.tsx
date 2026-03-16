'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const BLOG_POSTS = [
  {
    title: 'Eau de Parfum That Makes Romantic Evenings Truly Unforgettable',
    slug: 'eau-de-parfum-fragrances-for-romantic-evenings',
    excerpt:
      'Discover the eau de parfum for men and eau de parfum meaning, how these rich fragrances create unforgettable romantic evenings. Explore elegant oud scents.',
    image:
      'https://cms.edaperfumes.com/wp-content/uploads/2026/03/Eau-de-Parfum-Meaning.jpeg',
    date: 'March 2026',
    tags: ['Eau de Parfum', 'Eau de Parfum for Men', 'Eau de Parfum Meaning'],
  },
  {
    title: 'Heritage in Every Drop: Arabic Attar Perfume for Men for Eid 2026',
    slug: 'arabic-attar-perfume-for-men-for-eid-2026',
    excerpt:
      'This Eid 2026, elevate your presence with Arabic attar perfumes for men from EDA Perfumes. Enjoy heritage, luxury, and long-lasting fragrance in every drop.',
    image:
      'https://cms.edaperfumes.com/wp-content/uploads/2026/03/arabic-attar-perfume-for-men.jpeg',
    date: 'March 2026',
    tags: ['Arabic Attar Perfumes for Men', 'Attar Perfume For Men', 'Attar Perfumes For Eid'],
  },
  {
    title: 'Arabic Attar Perfumes for Ramadan Evening Gatherings and Iftar',
    slug: 'arabic-attar-perfumes-for-ramadan-evenings',
    excerpt:
      'Discover the elegance of Arabic attar perfumes for Ramadan gatherings. Explore long lasting oud, amber, and musk attars by EDA Perfumes, perfect for prayers, iftar, and evening celebrations.',
    image:
      'https://cms.edaperfumes.com/wp-content/uploads/2026/03/arabic-attar-perfumes-for-ramadan.jpeg',
    date: 'March 2026',
    tags: ['Arabic Attar Perfumes for Ramadan', 'Attar Perfume For Men', 'Oud Pocket Perfume'],
  },
  {
    title: 'From Ordinary to Magnetic: Best Perfume for Men Under 1000',
    slug: 'from-ordinary-to-magnetic-best-perfume-for-men-under-1000',
    excerpt:
      'Transform your vibe & Explore the best perfume for men under 1000 in India—floral, citrus, and vanilla fragrances that elevate confidence, leave lasting impressions.',
    image:
      'https://cms.edaperfumes.com/wp-content/uploads/2026/03/Best-Perfume-For-Men-Under-1000.jpeg',
    date: 'March 2026',
    tags: ['Best Perfume For Men Under 1000', 'Floral Citrus Vanilla Perfume', 'Luxury Perfume Gift Set', 'Perfume For Men Combo'],
  },
  {
    title: 'Bottling Main Character Energy with Luxury Perfume Gift Sets',
    slug: 'bottling-main-character-energy-with-luxury-perfume-gift-sets',
    excerpt:
      'Discover how EDA Perfumes\' luxury perfume gift sets and office perfume for men elevate your presence. Find scents that boost confidence, and give the main character energy.',
    image:
      'https://cms.edaperfumes.com/wp-content/uploads/2026/03/Luxury-Perfume-Gift-Sets.jpeg',
    date: 'March 2026',
    tags: ['Office Perfumes for Men', 'Luxury Perfume Gift Sets'],
  },
  {
    title: 'Wear Your Invisible Crown with Guilty Premium Perfume for Men',
    slug: 'wear-your-invisible-crown-with-guilty-premium-perfume-for-men',
    excerpt:
      'Discover how a guilty premium perfume for men enhances confidence, personal style, and presence. Learn how to choose signature and summer fragrances.',
    image:
      'https://cms.edaperfumes.com/wp-content/uploads/2026/03/IMG-20260307-WA0000.jpg',
    date: 'March 2026',
    tags: ['Guilty Premium Perfume For Men', 'Best Summer Perfumes For Men'],
  },
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
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag');

  const filteredPosts = activeTag
    ? BLOG_POSTS.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase())
      )
    : BLOG_POSTS;

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

      {/* Active Tag Filter */}
      {activeTag && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-4 sm:mb-6 flex items-center gap-3">
          <span className="text-sm text-gray-500">Filtered by:</span>
          <span className="inline-block bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-medium border border-rose-200">
            {activeTag}
          </span>
          <Link
            href="/blogs"
            className="text-xs text-gray-400 hover:text-rose-500 transition-colors underline"
          >
            Clear filter
          </Link>
        </div>
      )}

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.slug}
              className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <Link href={`/blogs/${post.slug}`}>
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blogs?tag=${encodeURIComponent(tag)}`}
                      className="inline-block bg-rose-50 text-rose-500 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border border-rose-100 hover:bg-rose-100 hover:border-rose-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                {/* Title */}
                <Link href={`/blogs/${post.slug}`}>
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors duration-300">
                    {post.title}
                  </h2>
                </Link>

                {/* Date */}
                <p className="text-[10px] sm:text-xs text-gray-400 font-light mb-2 sm:mb-3">{post.date}</p>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-gray-500 font-light line-clamp-3 mb-3 sm:mb-4">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <Link
                  href={`/blogs/${post.slug}`}
                  className="text-xs sm:text-sm text-rose-500 font-medium hover:text-rose-600 transition-colors inline-flex items-center gap-1"
                >
                  Read More
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

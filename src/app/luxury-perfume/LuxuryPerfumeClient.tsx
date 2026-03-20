'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard from "../../../components/ProductCard";
import { Product } from "./page";
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../../components/motion';

interface LuxuryPerfumeClientProps {
  products: Product[];
}

type ProductWithSlug = Product & {
  slug: string;
  regular_price: string;
};

export default function LuxuryPerfumeClient({ products }: LuxuryPerfumeClientProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const INITIAL_PRODUCTS = 6;
  const visibleProducts = showAllProducts ? products : products.slice(0, INITIAL_PRODUCTS);

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden">
        <img
          src="https://cms.edaperfumes.com/wp-content/uploads/2026/02/eda-perfumes-banner.jpg"
          alt="Luxury Perfume - EDA Perfumes"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Our Luxury Collection</h2>
            <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600 font-light">Discover our curated selection of premium fragrances</p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {visibleProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard
                product={{
                  ...product,
                  slug: product.slug || `product-${product.id}`
                } as ProductWithSlug}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {!showAllProducts && products.length > INITIAL_PRODUCTS && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAllProducts(true)}
              className="px-8 py-3 bg-black text-white text-sm font-medium tracking-wide rounded-lg hover:bg-gray-800 transition-colors"
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      {/* Content - Single Card with Read More */}
      <div className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                Luxury Perfume &mdash; Experience Timeless Elegance with EDA Perfumes
              </h1>

              <div className="text-gray-600 leading-7 text-sm sm:text-base">
                <p>A <strong>luxury perfume</strong> is not only a fragrance to the world of fragrance, but it represents an identity, statement, and experience. At <strong>EDA Perfumes</strong>, a selected range of high-quality fragrances is presented to our customers who value great style, beauty, and good impressions. Our collection will also be able to transform every moment whether it is a signature scent or that gift you have been giving.</p>
                <p className="mt-3">At <strong>EDA Perfumes</strong>, all fragrances are made in accurate amounts, with the enthusiasm and finest ingredients to provide an olfactory experience that is prolonged and unforgettable. Quality, authenticity, and craftsmanship are the core values of our company, which makes every bottle represent luxury.</p>

                {expanded && (
                  <>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-3" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>Discover the Essence of Luxury Perfume</h3>
                    <p>The real <strong>luxury perfume</strong> can be characterized by its composition, longevity, and the emotions it evokes. In contrast to the regular perfumes, the luxury fragrances are made out of the quality of ingredients and notes that are well blended and develop beautifully throughout the day.</p>
                    <p className="mt-3">As one of the emerging <Link href="https://www.edaperfumes.com/blogs/elevate-with-top-brands-of-perfume-for-women-eda-perfumes" className="underline decoration-rose-300 hover:decoration-rose-500 transition-colors"><strong>top brands of perfume for women</strong></Link>, <strong>EDA Perfumes</strong> have made specialty in high concentration Eau de Parfum (EDP) which is characterized by high concentration and performance. This keeps your perfume lingering in a beautiful way making a great impression everywhere you travel.</p>
                    <p className="mt-3">Each scent is a blend of artistry and science—combining top, heart, and base notes, to produce a fragrance profile that is in unison with your personality and style.</p>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-3" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>Luxury Perfume for Women &mdash; Designed for Elegance</h3>
                    <p>The process of finding the ideal <strong>luxury perfume for women</strong> is not only based on the choice of a pleasant smell, but it is a process that involves finding a fragrance that shows confidence, femininity, and uniqueness.</p>
                    <p className="mt-3">At <strong>EDA Perfumes</strong>, our collection of luxury fragrances for women is designed to enhance every mood and occasion. Out of gentle flowered mixtures to bright oriental notes, all perfumes are well designed to please the contemporary woman who appreciates elegance.</p>
                    <p className="mt-3">We have fragrances with such notes as jasmine, rose, vanilla, patchouli, which introduces a blend of sophistication and sensuality. These classic pairings render our perfumes a daily use and occasion scent.</p>
                    <p className="mt-3">Regardless of whether you like something faint and light or rich and spellbinding, our <strong>best luxury perfumes for her</strong> are designed to make you feel confident, powerful and memorable.</p>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-3" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>Best Luxury Perfumes for Her &mdash; Our Signature Collection</h3>
                    <p>Choosing the <strong>best luxury perfumes for her</strong> can be overwhelming, but <strong>EDA Perfumes</strong> makes the task easier by having a carefully designed set of signature perfumes.</p>
                    <p className="mt-3">Each perfume in our collection is designed to deliver:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Long-lasting fragrance of high EDP concentration.</li>
                      <li>Distinct aromas that are distinctive.</li>
                      <li>Day and night versatility.</li>
                      <li>Attractively packaged as a present.</li>
                    </ul>
                    <p className="mt-3">Our fragrances have a combination of floral, citrus, woody and gourmand notes to form unique formulations that develop as the day progresses. A smell can start with fresh citrus, move on to a floral heart, and finish with a warm and sensual base. By doing so, the full experience of fragrance is achieved.</p>
                    <p className="mt-3">These are the features that can be recognized as defining a perfume as a luxury one and as one of the <strong>best luxury perfumes for her</strong>.</p>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-3" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>Luxury Perfume Gift Sets &mdash; The Perfect Gift Choice</h3>
                    <p>One of the most considerate presents that you can bestow is a fragrance and our <strong>luxury perfume gift sets</strong> are made in such a way to make any occasion special.</p>
                    <p className="mt-3"><strong>EDA Perfumes</strong> sells elegant collections of perfumes separately, which put together several fragrances, giving the recipient an opportunity to experience various scent profiles. These packages are ideal for birthdays, anniversaries, festivals or even as a show of appreciation.</p>
                    <p className="mt-3">We also offer exclusive <Link href="https://www.edaperfumes.com/blogs/couple-perfume-set-fragrances-for-special-moments" className="underline decoration-rose-300 hover:decoration-rose-500 transition-colors"><strong>couple perfume gift sets</strong></Link>, designed for those who want matching scents for their shared fragrance experience. The gift sets serve as special presents which couples can give to each other on their wedding day or anniversary or other romantic moments because the sets represent their emotional bond and shared stylishness.</p>
                    <p className="mt-3">Our <strong>luxury mini perfume collections</strong> provide variety and convenience, making them ideal for those who love experimenting with different fragrances. These <strong>luxury perfume gift sets</strong> are practical but they are also fashionable and provide a holistic experience in a single package.</p>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-3" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>Luxury Perfume Box &mdash; Elegance in Every Detail</h3>
                    <p>The presentation of a fragrance is just as important as the scent itself. That&apos;s why every <strong>luxury perfume box</strong> at <strong>EDA Perfumes</strong> is designed with elegance and sophistication in mind.</p>
                    <p className="mt-3">The manner in which a fragrance is presented is equally important as its smell is. That is why every <strong>luxury perfume box</strong> at <strong>EDA Perfumes</strong> is created with the purpose of elegance and sophistication in mind.</p>
                    <p className="mt-3">Our packaging reflects the premium nature of our products, featuring:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Sleek and modern designs</li>
                      <li>High-quality materials</li>
                      <li>Gift-ready presentation</li>
                      <li>Protective packaging to preserve fragrance quality</li>
                    </ul>
                    <p className="mt-3">A well-crafted <Link href="https://www.edaperfumes.com/blogs/bottling-main-character-energy-with-luxury-perfume-gift-sets" className="underline decoration-rose-300 hover:decoration-rose-500 transition-colors"><strong>luxury perfume box</strong></Link> enhances the overall experience, and it should be given as a gift or to use it to add sophistication to your personal collection.</p>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-3" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>Why Choose EDA Perfumes for Luxury Perfume?</h3>
                    <p><strong>EDA Perfumes</strong> is a company that is distinguished within the fragrance industry due to its commitment to its quality, craftsmanship, and customer satisfaction. The following gives us the confidence of the choice:</p>
                    <h4 className="text-base font-semibold text-gray-800 mt-4 mb-1">1. Premium Ingredients</h4>
                    <p>Our choice of ingredients is very critical and we make sure that each fragrance is of high quality and performance.</p>
                    <h4 className="text-base font-semibold text-gray-800 mt-4 mb-1">2. Long-Lasting Formulas</h4>
                    <p>We have made sure that our EDP concentration makes your <strong>luxury perfume</strong> last almost the whole day so that one does not have to apply it very often.</p>
                    <h4 className="text-base font-semibold text-gray-800 mt-4 mb-1">3. Artisan Craftsmanship</h4>
                    <p>All the perfumes are made in a very detailed way, combining the notes to give the product a harmonious and exquisite smell.</p>
                    <h4 className="text-base font-semibold text-gray-800 mt-4 mb-1">4. Versatile Collections</h4>
                    <p>From <Link href="https://www.edaperfumes.com/blogs/bottling-main-character-energy-with-luxury-perfume-gift-sets" className="underline decoration-rose-300 hover:decoration-rose-500 transition-colors"><strong>luxury perfume for women</strong></Link> to unisex fragrances and <strong>couple perfume gift sets</strong>, our collection caters to diverse preferences and occasions.</p>
                    <h4 className="text-base font-semibold text-gray-800 mt-4 mb-1">5. Elegant Packaging</h4>
                    <p>Our <strong>luxury perfume box</strong> ensures that every purchase is special, either as a personal use or a gift.</p>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-3" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>How to Choose the Right Luxury Perfume</h3>
                    <p>The choice of the ideal <strong>luxury perfume</strong> is limited to your tastes, character and occasion. To make the decision, these are some of the tips that could assist you:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li><strong>Know Your Notes:</strong> Floral, woody, citrus, and oriental notes are different in creating moods.</li>
                      <li><strong>Consider Longevity:</strong> EDP perfumes have a better performance duration.</li>
                      <li><strong>Match the Occasion:</strong> Light scents for daytime, deeper notes for evenings</li>
                      <li><strong>Test and Explore:</strong> Try different fragrances to find your signature scent</li>
                    </ul>
                    <p className="mt-3">This is simplified by <strong>EDA Perfumes</strong>, which offers such a process as the <strong>luxury perfume gift sets</strong>, so that you can taste several different fragrances before making a decision.</p>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-3" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>Experience True Luxury with EDA Perfumes</h3>
                    <p>At its core, a <strong>luxury perfume</strong> is about more than fragrance—it is about the feeling you have. Our essence is confidence, elegance and individuality.</p>
                    <p className="mt-3"><strong>EDA Perfumes</strong> invites you to explore a world of premium fragrances designed to elevate your everyday experience. Whether you&apos;re searching for the <strong>best luxury perfumes for her</strong>, a stylish <strong>luxury perfume box</strong>, or elegant <strong>luxury perfume gift sets</strong>, or exclusive <Link href="https://www.edaperfumes.com/blogs/couple-perfume-set-fragrances-for-special-moments" className="underline decoration-rose-300 hover:decoration-rose-500 transition-colors"><strong>couple perfume gift sets</strong></Link>, you&apos;ll find everything you need in our collection.</p>
                    <p className="mt-3">Find your personal perfume tomorrow and change the definition of luxury to yourself. Experience the art of fragrance with <strong>EDA Perfumes</strong> - each perfume comes with a story, and each bottle comes with class.</p>
                  </>
                )}
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block transition-colors"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Contact Section */}
      <div className="border-t border-gray-200 bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
            Need Assistance?
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
          <p className="text-sm text-gray-600 mb-8 font-light">
            Our fragrance consultants are here to help you find your perfect scent
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:care@edaperfumes.com"
              className="inline-block px-8 py-3 text-xs text-black border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-colors tracking-widest uppercase font-light"
            >
              Email Us
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 text-xs text-black border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-colors tracking-widest uppercase font-light"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

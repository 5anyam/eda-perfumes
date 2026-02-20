"use client"
import React, { useState } from 'react';
import { X } from 'lucide-react';

// Modal Component
function ConsultationModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-block px-8 py-3 text-xs text-white bg-black hover:bg-gray-800 transition-colors tracking-widest uppercase font-light"
      >
        Find Your Fragrance
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-md w-full mx-4 border border-gray-200">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
              <h3 className="text-xl font-light text-gray-900 tracking-wide">Get in Touch</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm font-light"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm font-light"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm font-light"
              />
              <textarea
                placeholder="Your message..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm font-light resize-none"
              ></textarea>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-black text-white py-3 text-xs tracking-widest uppercase font-light hover:bg-gray-800 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AboutClient() {
  return (
    <main className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-20 space-y-20">
        {/* Hero Section */}
        <section className="text-center border-b border-gray-200 pb-20">
          <h1 className="text-4xl lg:text-5xl font-light mb-6 text-gray-900 tracking-wide">
            About EDA Perfumes
          </h1>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-8"></div>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Crafting sophisticated fragrances for those who appreciate luxury and elegance
          </p>
        </section>
        
        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-square overflow-hidden">
            <img
              src="https://cms.edaperfumes.com/wp-content/uploads/2026/02/ChatGPT-Image-Feb-20-2026-04_15_06-PM.png"
              alt="Our Vision - EDA Perfumes"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-light mb-6 text-gray-900 tracking-wide">
              The Art of Fragrance
            </h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed font-light">
              We believe that fragrance is more than scent – it is an expression of identity and style. Our collection embodies sophistication and elegance, crafted for those who appreciate the finer things.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-b border-gray-200 py-20">
          <h2 className="text-3xl lg:text-4xl font-light mb-12 text-center text-gray-900 tracking-wide">
            Our Values
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-16"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'Quality', desc: 'Premium ingredients and artisan craftsmanship' },
              { title: 'Elegance', desc: 'Sophisticated compositions for discerning tastes' },
              { title: 'Authenticity', desc: 'Genuine luxury and timeless appeal' },
              { title: 'Excellence', desc: 'Dedicated to perfection in every detail' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="font-light text-base mb-3 text-gray-900 tracking-wide uppercase text-xs">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-light mb-6 text-gray-900 tracking-wide">
              Our Philosophy
            </h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed font-light">
              We craft each fragrance with meticulous attention to detail. Every scent is a carefully composed blend designed to create lasting impressions.
            </p>
            <div className="bg-gray-50 p-6 border-l-2 border-gray-900">
              <h3 className="font-light text-sm text-gray-900 mb-2 uppercase tracking-widest">
                Our Commitment
              </h3>
              <p className="text-gray-600 text-sm font-light">
                Each fragrance represents our dedication to quality and sophistication, designed to complement individual style.
              </p>
            </div>
          </div>
          <div className="aspect-square overflow-hidden">
            <img
              src="https://cms.edaperfumes.com/wp-content/uploads/2026/02/ChatGPT-Image-Feb-20-2026-04_22_42-PM.png"
              alt="Premium Quality - EDA Perfumes"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Journey */}
        <section className="border-t border-gray-200 pt-20">
          <h2 className="text-3xl lg:text-4xl font-light mb-12 text-center text-gray-900 tracking-wide">
            The Experience
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-16"></div>
          <div className="grid md:grid-cols-5 gap-8">
            {[
              { step: "01", title: "Discovery", desc: "Explore our fragrance collection" },
              { step: "02", title: "Selection", desc: "Choose your signature scent" },
              { step: "03", title: "Experience", desc: "Enjoy premium quality" },
              { step: "04", title: "Confidence", desc: "Make your impression" },
              { step: "05", title: "Signature", desc: "Own your unique style" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                {index === 0 ? (
                  <div className="w-[70px] h-[70px] overflow-hidden mx-auto mb-4">
                    <img
                      src="https://cms.edaperfumes.com/wp-content/uploads/2026/02/1-1.png"
                      alt="Discovery - EDA Perfumes"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : index === 1 ? (
                  <div className="w-[70px] h-[70px] overflow-hidden mx-auto mb-4">
                    <img
                      src="https://cms.edaperfumes.com/wp-content/uploads/2026/02/2-1.png"
                      alt="Selection - EDA Perfumes"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : index === 2 ? (
                  <div className="w-[70px] h-[70px] overflow-hidden mx-auto mb-4">
                    <img
                      src="https://cms.edaperfumes.com/wp-content/uploads/2026/02/3-1.png"
                      alt="Experience - EDA Perfumes"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : index === 3 ? (
                  <div className="w-[70px] h-[70px] overflow-hidden mx-auto mb-4">
                    <img
                      src="https://cms.edaperfumes.com/wp-content/uploads/2026/02/4-1.png"
                      alt="Confidence - EDA Perfumes"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-[70px] h-[70px] overflow-hidden mx-auto mb-4">
                    <img
                      src="https://cms.edaperfumes.com/wp-content/uploads/2026/02/5-1.png"
                      alt="Signature - EDA Perfumes"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-light text-sm mb-2 text-gray-900 tracking-wide">{item.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Difference */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-square overflow-hidden">
            <img
              src="https://cms.edaperfumes.com/wp-content/uploads/2026/02/ChatGPT-Image-Feb-20-2026-04_30_30-PM.png"
              alt="Crafted Excellence - EDA Perfumes"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-light mb-6 text-gray-900 tracking-wide">
              The Difference
            </h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed font-light">
              We create experiences through carefully crafted fragrances. Each scent embodies quality and sophistication.
            </p>
            <div className="space-y-4">
              <div className="flex items-start border-l-2 border-gray-200 pl-4">
                <p className="text-gray-600 text-sm font-light">Premium EDP concentration for lasting presence</p>
              </div>
              <div className="flex items-start border-l-2 border-gray-200 pl-4">
                <p className="text-gray-600 text-sm font-light">Carefully selected ingredients</p>
              </div>
              <div className="flex items-start border-l-2 border-gray-200 pl-4">
                <p className="text-gray-600 text-sm font-light">Elegant presentation and packaging</p>
              </div>
              <div className="flex items-start border-l-2 border-gray-200 pl-4">
                <p className="text-gray-600 text-sm font-light">Designed for sophisticated tastes</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center border-t border-gray-200 pt-20 pb-8">
          <h2 className="text-3xl lg:text-4xl font-light mb-6 text-gray-900 tracking-wide">
            Discover Your Signature Scent
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-8"></div>
          <p className="text-base mb-8 text-gray-600 max-w-2xl mx-auto font-light">
            Explore our collection of sophisticated fragrances
          </p>
          <ConsultationModal />
        </section>
      </div>
    </main>
  );
}

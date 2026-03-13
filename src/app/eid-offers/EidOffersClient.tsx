'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../../../lib/woocommerceApi';
import { useCart } from '../../../lib/cart';
import Link from 'next/link';
import { Star, Gift, Check, ShoppingBag, ShoppingCart, Moon } from 'lucide-react';
import { ScrollReveal, HeroText } from '../../../components/motion';

interface ExtendedProduct extends Product {
  slug?: string;
  regular_price?: string;
  categories?: { id: number; name: string; slug?: string }[];
}

const BUNDLE_PRICE = 899;

export default function EidOffersClient() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selected100ml, setSelected100ml] = useState<ExtendedProduct | null>(null);
  const [selected10ml, setSelected10ml] = useState<ExtendedProduct | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  const { data, isLoading } = useQuery<ExtendedProduct[]>({
    queryKey: ['eid-offer-products'],
    queryFn: async () => {
      const result = await fetchProducts(1, 100);
      return (result || []) as ExtendedProduct[];
    },
    staleTime: 10 * 60 * 1000,
  });

  const allProducts = Array.isArray(data) ? data : [];

  // Find Oudh Shukran Eau de Parfum - 100ml (static/mandatory, individual only)
  const oudSuffreen = allProducts.find((p) =>
    (p.slug === 'oudh-shukran-eau-de-parfum-100ml') ||
    (/oudh\s*shukran/i.test(p.name) && /100\s*ml/i.test(p.name) && !/combo|duo|set|bundle|pack|\+|2\s*x/i.test(p.name))
  );

  // Filter 100ml perfumes (exclude combos, packs, and Oudh Shukran itself)
  const mainPerfumes = allProducts.filter((p) =>
    /100\s*ml/i.test(p.name) &&
    !/combo|duo|set|bundle|pack|\+|2\s*x/i.test(p.name) &&
    !(oudSuffreen && p.id === oudSuffreen.id)
  );

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(
    mainPerfumes.flatMap(p => p.categories?.map(c => c.name) || [])
  )).filter(Boolean)];

  // Filter by category
  const filteredMainPerfumes = selectedCategory === 'All'
    ? mainPerfumes
    : mainPerfumes.filter(p => p.categories?.some(c => c.name === selectedCategory));

  // Filter 10ml products
  const miniPerfumes = allProducts.filter((p) =>
    /10\s*ml/i.test(p.name) &&
    !/\+/.test(p.name) &&
    !/2\s*[x×]\s*10\s*ml/i.test(p.name) &&
    !/combo|pack|bundle|duo|set/i.test(p.name)
  );

  const handleQuickAddToCart = (e: React.MouseEvent, product: ExtendedProduct) => {
    e.stopPropagation();
    setAddedProducts(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedProducts(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  const handleSelect100ml = (product: ExtendedProduct) => {
    if (selected100ml?.id === product.id) {
      setSelected100ml(null);
    } else {
      setSelected100ml(product);
    }
    setAddedToCart(false);
  };

  const handleSelect10ml = (product: ExtendedProduct) => {
    if (selected10ml?.id === product.id) {
      setSelected10ml(null);
    } else {
      setSelected10ml(product);
    }
    setAddedToCart(false);
  };

  const isComplete = oudSuffreen && selected100ml && selected10ml;

  const handleAddToCart = () => {
    if (!isComplete || addedToCart) return;
    setAddedToCart(true);

    // Split bundle price proportionally between Oudh Shukran and selected 100ml
    const suffreenPrice = Number(oudSuffreen.price) || 0;
    const mainPrice = Number(selected100ml.price) || 0;
    const totalActual = suffreenPrice + mainPrice;

    const suffreenShare = totalActual > 0
      ? Math.round(BUNDLE_PRICE * suffreenPrice / totalActual)
      : Math.round(BUNDLE_PRICE / 2);
    const mainShare = BUNDLE_PRICE - suffreenShare;

    // Add Oudh Shukran
    addToCart({
      id: oudSuffreen.id,
      name: oudSuffreen.name,
      price: suffreenShare.toString(),
      regular_price: oudSuffreen.regular_price || oudSuffreen.price,
      images: oudSuffreen.images?.map(img => ({ src: img.src })) || [],
    });

    // Add selected 100ml
    addToCart({
      id: selected100ml.id,
      name: selected100ml.name,
      price: mainShare.toString(),
      regular_price: selected100ml.regular_price || selected100ml.price,
      images: selected100ml.images?.map(img => ({ src: img.src })) || [],
    });

    // Add selected 10ml as FREE
    addToCart({
      id: -(selected10ml.id),
      name: `${selected10ml.name} (FREE Gift)`,
      price: '0',
      regular_price: selected10ml.regular_price || selected10ml.price,
      images: selected10ml.images?.map(img => ({ src: img.src })) || [],
    });

    router.push('/cart');
  };

  const totalOriginalPrice = () => {
    let total = Number(oudSuffreen?.price) || 0;
    if (selected100ml) total += Number(selected100ml.price) || 0;
    if (selected10ml) total += Number(selected10ml.price) || 0;
    return total;
  };

  const savings = totalOriginalPrice() - BUNDLE_PRICE;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!oudSuffreen) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Eid offer products loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
      {/* Hero Banner */}
      <section className="w-full">
        <a href="#selection-section" className="block cursor-pointer">
          <img
            src="https://cms.edaperfumes.com/wp-content/uploads/2026/03/EDA-899-Static-ad-12-mar.jpg.jpeg"
            alt="Eid Special Offer @₹899 - EDA Perfumes"
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </a>
      </section>

      {/* Static Oudh Shukran Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
                <Check className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                Oudh Shukran (100ml)
                <span className="text-emerald-600 ml-2 text-lg">Included</span>
              </h2>
            </div>

            <div className="max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-lg ring-2 ring-emerald-500">
              <div className="relative aspect-square bg-gray-50">
                <img
                  src={oudSuffreen.images?.[0]?.src || '/placeholder.png'}
                  alt={oudSuffreen.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Included in Bundle
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  100ml
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{oudSuffreen.name}</h3>
                <p className="text-sm text-gray-500 line-through">₹{Number(oudSuffreen.price).toLocaleString()}</p>
                <p className="text-emerald-600 font-bold text-sm mt-1">Part of Eid Bundle</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Step 2: Select 1 x 100ml */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${selected100ml ? 'bg-green-500' : 'bg-emerald-500'}`}>
                {selected100ml ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                Choose 1 Signature Perfume (100ml)
                <span className={`ml-2 text-lg ${selected100ml ? 'text-green-600' : 'text-emerald-600'}`}>
                  ({selected100ml ? '1/1 selected' : '0/1 selected'})
                </span>
              </h2>
            </div>

            {/* Category Filter */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMainPerfumes.map((product) => {
                const isSelected = selected100ml?.id === product.id;
                const isDisabled = selected100ml && !isSelected;

                return (
                  <div
                    key={product.id}
                    onClick={() => !isDisabled && handleSelect100ml(product)}
                    className={`cursor-pointer bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 shadow-lg scale-[1.02]'
                        : isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-md border border-gray-100'
                    }`}
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={product.images?.[0]?.src || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1.5 rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        100ml
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-light text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-emerald-600 font-semibold text-sm">₹{Number(product.price).toLocaleString()}</p>
                        <button
                          onClick={(e) => { handleQuickAddToCart(e, product); handleSelect100ml(product); }}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            addedProducts.has(product.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600'
                          }`}
                        >
                          {addedProducts.has(product.id) ? (
                            <><Check className="w-3 h-3" /> Added</>
                          ) : (
                            <><ShoppingCart className="w-3 h-3" /> Add</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Step 3: Select 1 x 10ml */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${selected10ml ? 'bg-green-500' : 'bg-emerald-500'}`}>
                {selected10ml ? <Check className="w-5 h-5" /> : '3'}
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                Choose 1 FREE Travel Size (10ml)
                <span className={`ml-2 text-lg ${selected10ml ? 'text-green-600' : 'text-emerald-600'}`}>
                  ({selected10ml ? '1/1 selected' : '0/1 selected'})
                </span>
              </h2>
              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                FREE
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {miniPerfumes.map((product) => {
                const isSelected = selected10ml?.id === product.id;
                const isDisabled = selected10ml && !isSelected;

                return (
                  <div
                    key={product.id}
                    onClick={() => !isDisabled && handleSelect10ml(product)}
                    className={`cursor-pointer bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-green-500 shadow-lg'
                        : isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-md border border-gray-100'
                    }`}
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={product.images?.[0]?.src || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                        FREE
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-light text-gray-900 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-green-600 font-semibold text-xs">₹{Number(product.price).toLocaleString()}</p>
                        <button
                          onClick={(e) => { handleQuickAddToCart(e, product); handleSelect10ml(product); }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                            addedProducts.has(product.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600'
                          }`}
                        >
                          {addedProducts.has(product.id) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <ShoppingCart className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Summary & Add to Cart */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-emerald-100">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Moon className="w-6 h-6 text-emerald-500" />
              <h3 className="text-xl font-light text-gray-900">Your Eid Bundle</h3>
            </div>

            <div className="space-y-4 mb-6">
              {/* Oudh Shukran */}
              <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-lg">
                <div className="w-16 h-16 bg-emerald-100 rounded-lg overflow-hidden flex-shrink-0">
                  {oudSuffreen && (
                    <img src={oudSuffreen.images?.[0]?.src || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{oudSuffreen?.name}</p>
                  <p className="text-xs text-emerald-600 font-medium">100ml - Included</p>
                </div>
                <Check className="w-5 h-5 text-green-500" />
              </div>

              {/* Selected 100ml */}
              <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-lg">
                <div className="w-16 h-16 bg-emerald-100 rounded-lg overflow-hidden flex-shrink-0">
                  {selected100ml && (
                    <img src={selected100ml.images?.[0]?.src || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selected100ml ? selected100ml.name : 'Select 1 signature perfume'}
                  </p>
                  <p className="text-xs text-gray-500">100ml Bottle</p>
                </div>
                {selected100ml && <Check className="w-5 h-5 text-green-500" />}
              </div>

              {/* Selected 10ml */}
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-lg overflow-hidden flex-shrink-0">
                  {selected10ml && (
                    <img src={selected10ml.images?.[0]?.src || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selected10ml ? selected10ml.name : 'Select 1 travel size'}
                  </p>
                  <p className="text-xs text-green-600 font-medium">10ml - FREE!</p>
                </div>
                {selected10ml && <Check className="w-5 h-5 text-green-500" />}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Original Price (3 perfumes):</span>
                <span className="line-through">₹{totalOriginalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>You Save:</span>
                <span className="font-medium">₹{savings > 0 ? savings.toLocaleString() : '1,500'}</span>
              </div>
              <div className="flex justify-between text-xl font-medium text-gray-900">
                <span>Eid Bundle Price:</span>
                <span className="text-emerald-600">₹899</span>
              </div>
            </div>

            {addedToCart ? (
              <div className="space-y-3">
                <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                  <Check className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-medium">Added to Cart!</p>
                </div>
                <Link
                  href="/cart"
                  className="block w-full py-4 bg-black text-white text-center rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 inline mr-2" />
                  View Cart & Checkout
                </Link>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!isComplete}
                className={`w-full py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  isComplete
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Moon className="w-5 h-5" />
                {isComplete ? 'Add Eid Bundle to Cart - ₹899' : 'Complete Your Selection'}
              </button>
            )}

            {!isComplete && (
              <p className="text-center text-sm text-gray-500 mt-4">
                {!selected100ml && !selected10ml
                  ? 'Select 1 signature perfume and 1 free travel size'
                  : !selected100ml
                  ? 'Select 1 signature perfume (100ml)'
                  : 'Select 1 free travel size (10ml)'}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../../../lib/woocommerceApi';
import { useCart } from '../../../lib/cart';
import Link from 'next/link';
import { Sparkles, ShoppingBag, Check, Gift, ArrowRight, ShoppingCart } from 'lucide-react';

interface ExtendedProduct extends Product {
  slug?: string;
  regular_price?: string;
  categories?: { id: number; name: string; slug?: string }[];
}

export default function BuyOneGetOneFreeClient() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedMain, setSelectedMain] = useState<ExtendedProduct | null>(null);
  const [selectedSecond, setSelectedSecond] = useState<ExtendedProduct[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCategory2, setSelectedCategory2] = useState<string>('All');
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  const OFFER_PRICE = 399;

  const { data, isLoading } = useQuery<ExtendedProduct[]>({
    queryKey: ['buy1get1-products'],
    queryFn: async () => {
      const result = await fetchProducts(1, 100);
      return (result || []) as ExtendedProduct[];
    },
    staleTime: 10 * 60 * 1000,
  });

  const allProducts = Array.isArray(data) ? data : [];

  // Filter main perfumes (100ml) - exclude combos and packs
  const mainPerfumes = allProducts.filter((p) =>
    /100\s*ml/i.test(p.name) && !/combo|duo|set|bundle|pack|\+|2\s*x/i.test(p.name)
  );

  // Get unique categories from main perfumes
  const categories = ['All', ...Array.from(new Set(
    mainPerfumes.flatMap(p => p.categories?.map(c => c.name) || [])
  )).filter(Boolean)];

  // Filter main perfumes by selected category (Step 1)
  const filteredMainPerfumes = selectedCategory === 'All'
    ? mainPerfumes
    : mainPerfumes.filter(p => p.categories?.some(c => c.name === selectedCategory));

  // Filter 10ml products for Step 2 (free travel size)
  const miniPerfumes = allProducts.filter((p) =>
    /10\s*ml/i.test(p.name) &&
    !/\+/.test(p.name) &&
    !/2\s*[x×]\s*10\s*ml/i.test(p.name) &&
    !/combo|pack|bundle|duo|set/i.test(p.name)
  );

  const filteredSecondPerfumes = selectedCategory2 === 'All'
    ? miniPerfumes
    : miniPerfumes.filter(p => p.categories?.some(c => c.name === selectedCategory2));

  const handleMainSelect = (product: ExtendedProduct) => {
    setSelectedMain(product);
    setStep(2);
    setAddedToCart(false);
  };

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

  const handleSecondSelect = (product: ExtendedProduct) => {
    const alreadySelected = selectedSecond.find(p => p.id === product.id);
    if (alreadySelected) {
      setSelectedSecond(selectedSecond.filter(p => p.id !== product.id));
    } else if (selectedSecond.length < 2) {
      setSelectedSecond([...selectedSecond, product]);
    }
    setAddedToCart(false);
  };

  const handleAddToCart = () => {
    if (!selectedMain || selectedSecond.length !== 2 || addedToCart) return;
    setAddedToCart(true);

    // Add 100ml at bundle price
    addToCart({
      id: selectedMain.id,
      name: selectedMain.name,
      price: OFFER_PRICE.toString(),
      regular_price: selectedMain.regular_price || selectedMain.price,
      images: selectedMain.images?.map(img => ({ src: img.src })) || [],
    });

    // Add both 10ml as FREE
    selectedSecond.forEach((product, index) => {
      addToCart({
        id: -(product.id + index * 100000),
        name: `${product.name} (FREE Gift)`,
        price: '0',
        regular_price: product.regular_price || product.price,
        images: product.images?.map(img => ({ src: img.src })) || [],
      });
    });

    router.push('/cart');
  };

  const resetSelection = () => {
    setSelectedMain(null);
    setSelectedSecond([]);
    setStep(1);
    setAddedToCart(false);
  };

  const isComplete = selectedMain && selectedSecond.length === 2;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="w-full">
        <a href="#selection-section" className="block cursor-pointer">
          <img
            src="https://cms.edaperfumes.com/wp-content/uploads/2026/03/Artboard-2-copy.jpg-1.jpeg"
            alt="Buy 1 Get 1 FREE @ ₹399 - Eda Perfumes"
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </a>
      </section>

      <div id="selection-section" className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                selectedMain ? 'bg-teal-500 text-white' : step === 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {selectedMain ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <div className="hidden md:block">
                <p className="font-semibold text-gray-800">First Perfume</p>
                <p className="text-xs text-gray-500">100ml Signature</p>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-300" />

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                selectedSecond.length === 2 ? 'bg-teal-500 text-white' : step === 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {selectedSecond.length === 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <div className="hidden md:block">
                <p className="font-semibold text-gray-800">2 Free Travel Sizes</p>
                <p className="text-xs text-gray-500">10ml x 2 FREE</p>
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className={selectedMain ? 'text-teal-600 font-medium' : 'text-gray-400'}>
              {selectedMain ? `✓ ${selectedMain.name.split(' ').slice(0, 3).join(' ')}` : '○ Select first perfume'}
            </span>
            <span className="text-gray-300">+</span>
            <span className={selectedSecond.length > 0 ? 'text-teal-600 font-medium' : 'text-gray-400'}>
              {selectedSecond.length === 2
                ? `✓ ${selectedSecond[0].name.split(' ').slice(0, 2).join(' ')} + ${selectedSecond[1].name.split(' ').slice(0, 2).join(' ')} (FREE)`
                : selectedSecond.length === 1
                ? `✓ ${selectedSecond[0].name.split(' ').slice(0, 3).join(' ')} (1/2 FREE)`
                : '○ Select 2 free 10ml'}
            </span>
          </div>
        </div>

        {/* Step 1: First Perfume Selection */}
        {step === 1 && !selectedMain && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-500" />
              Step 1: Choose Your First Perfume (100ml)
            </h2>

            {/* Category Filter Tabs */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-teal-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredMainPerfumes.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleMainSelect(product)}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-teal-400"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      100ml
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-teal-600 font-bold">₹{Number(product.price).toLocaleString()}</p>
                      <button
                        onClick={(e) => { handleQuickAddToCart(e, product); handleMainSelect(product); }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          addedProducts.has(product.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-teal-500 text-white hover:bg-teal-600'
                        }`}
                      >
                        {addedProducts.has(product.id) ? (
                          <>
                            <Check className="w-3 h-3" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Second Perfume Selection */}
        {step === 2 && selectedMain && !isComplete && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Gift className="w-6 h-6 text-teal-500" />
                Step 2: Choose 2 FREE Travel Sizes (10ml)
              </h2>
              <button
                onClick={() => { setStep(1); setSelectedMain(null); }}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                ← Change First Perfume
              </button>
            </div>

            {/* Selected Main */}
            <div className="bg-teal-50 rounded-xl p-4 mb-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {selectedMain.images && selectedMain.images[0] && (
                  <img
                    src={selectedMain.images[0].src}
                    alt={selectedMain.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-xs text-teal-600 font-semibold">FIRST PERFUME</p>
                <p className="font-semibold text-gray-800">{selectedMain.name}</p>
                <p className="text-sm text-gray-500">100ml</p>
              </div>
              <Check className="w-6 h-6 text-teal-500 ml-auto" />
            </div>

            {/* Category Filter Tabs for Step 2 */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory2(category)}
                    className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                      selectedCategory2 === category
                        ? 'bg-teal-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredSecondPerfumes.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSecondSelect(product)}
                  className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 ${
                    selectedSecond.some(p => p.id === product.id)
                      ? 'ring-2 ring-green-500 shadow-lg scale-[1.02]'
                      : selectedSecond.length >= 2
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-teal-400'
                  }`}
                >
                  <div className="relative aspect-square bg-gray-100">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {selectedSecond.some(p => p.id === product.id) ? (
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : null}
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      FREE
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-green-600 font-bold text-xs line-through">₹{Number(product.price).toLocaleString()}</p>
                      <button
                        onClick={(e) => { handleQuickAddToCart(e, product); handleSecondSelect(product); }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          selectedSecond.some(p => p.id === product.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-teal-500 text-white hover:bg-teal-600'
                        }`}
                      >
                        {selectedSecond.some(p => p.id === product.id) ? (
                          <>
                            <Check className="w-3 h-3" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        {isComplete && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Your Bundle
                </h2>
              </div>

              <div className="p-6">
                {/* First Perfume */}
                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl mb-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {selectedMain.images && selectedMain.images[0] && (
                      <img
                        src={selectedMain.images[0].src}
                        alt={selectedMain.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-teal-600 font-semibold mb-1">FIRST PERFUME</p>
                    <h3 className="font-semibold text-gray-800">{selectedMain.name}</h3>
                    <p className="text-sm text-gray-500">100ml Eau de Parfum</p>
                  </div>
                  <Check className="w-6 h-6 text-teal-500" />
                </div>

                {/* Free 10ml #1 */}
                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl mb-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {selectedSecond[0]?.images && selectedSecond[0].images[0] && (
                      <img
                        src={selectedSecond[0].images[0].src}
                        alt={selectedSecond[0].name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-green-600 font-semibold mb-1">FREE TRAVEL SIZE #1</p>
                    <h3 className="font-semibold text-gray-800">{selectedSecond[0]?.name}</h3>
                    <p className="text-sm text-green-600 font-medium">10ml - FREE!</p>
                  </div>
                  <Check className="w-6 h-6 text-teal-500" />
                </div>

                {/* Free 10ml #2 */}
                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl mb-6">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {selectedSecond[1]?.images && selectedSecond[1].images[0] && (
                      <img
                        src={selectedSecond[1].images[0].src}
                        alt={selectedSecond[1].name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-green-600 font-semibold mb-1">FREE TRAVEL SIZE #2</p>
                    <h3 className="font-semibold text-gray-800">{selectedSecond[1]?.name}</h3>
                    <p className="text-sm text-green-600 font-medium">10ml - FREE!</p>
                  </div>
                  <Check className="w-6 h-6 text-teal-500" />
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">First Perfume (100ml)</span>
                    <span className="text-gray-400 line-through">₹{selectedMain.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">2 Free Travel Sizes (10ml)</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
                    <span className="text-gray-800">Bundle Price</span>
                    <span className="text-teal-600">₹{OFFER_PRICE}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transform hover:scale-[1.02]'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-6 h-6" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-6 h-6" />
                        Add to Cart - ₹{OFFER_PRICE}
                      </>
                    )}
                  </button>

                  {!addedToCart && (
                    <button
                      onClick={resetSelection}
                      className="w-full py-3 text-teal-600 font-medium hover:bg-teal-50 rounded-xl transition-colors"
                    >
                      Start Over
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

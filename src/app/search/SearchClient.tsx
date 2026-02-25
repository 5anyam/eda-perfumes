'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  images?: { src: string; alt?: string }[];
};

const WC_API = '/api/wc';
const CONSUMER_KEY = 'ck_b1a13e4236dd41ec9b8e6a1720a69397ddd12da6';
const CONSUMER_SECRET = 'cs_d8439cfabc73ad5b9d82d1d3facea6711f24dfd1';

function getQuery(): string {
  if (typeof window === 'undefined') return '';
  const p = new URLSearchParams(window.location.search);
  return p.get('q')?.trim() || '';
}

export default function SearchPage() {
  const [query, setQuery] = useState<string>('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products on mount
  useEffect(() => {
    async function fetchAll() {
      try {
        const products: Product[] = [];
        let page = 1;
        while (true) {
          const url = `${WC_API}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100&page=${page}&status=publish`;
          const res = await fetch(url);
          if (!res.ok) break;
          const data = await res.json();
          if (!Array.isArray(data) || data.length === 0) break;
          products.push(...data);
          if (data.length < 100) break;
          page++;
        }
        setAllProducts(products);
      } catch {
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  useEffect(() => {
    setQuery(getQuery());
    const onPop = () => setQuery(getQuery());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const results = useMemo(() => {
    if (!query) return allProducts;
    const q = query.toLowerCase();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  }, [query, allProducts]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <p className="text-gray-600 mb-6">
        {query ? (
          <>Showing results for: <span className="font-semibold">{query}</span></>
        ) : (
          <span className="font-semibold">All products</span>
        )}
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      ) : results.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {results.map(p => {
            const image = p.images?.[0]?.src;
            return (
              <article key={p.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition">
                <Link href={`/product/${p.slug}`} className="block">
                  <div className="aspect-[4/3] bg-gray-100">
                    {image && (
                      <img src={image} alt={p.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{p.name}</h3>
                    {p.price && <div className="text-teal-600 font-semibold text-sm mt-1">₹{p.price}</div>}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme, getCollection, ProductCard, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

function PlaceholderCard() {
  return (
    <div className="flex flex-col">
      <div
        className="aspect-[3/4] rounded-xl flex items-center justify-center"
        style={{ backgroundColor: '#f5f5f5' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d4d4d4"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <div className="mt-3 space-y-2 px-0.5">
        <div className="h-2.5 w-2/3 rounded" style={{ backgroundColor: '#ebebeb' }} />
        <div className="h-2.5 w-1/4 rounded" style={{ backgroundColor: '#f0f0f0' }} />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const { theme, storeConfig } = useTheme();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  const products_settings = theme?.settings?.products;
  if (!products_settings?.enabled) return null;

  const heading = products_settings.heading || 'Featured Products';
  const collectionHandle = products_settings.collection || 'all';
  const limit = parseInt(products_settings.limit || '8');
  const columns = parseInt(products_settings.columns || '4');
  const viewAllLink = products_settings.viewAllLink || '/collections/';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!domain || !collectionHandle) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const collection = await getCollection(domain, collectionHandle);
        if (collection) {
          const productList = collection.products?.map((p: any) => p.product || p) || [];
          setProducts(productList.slice(0, limit));
        }
      } catch (error: any) {
        if (error?.response?.status !== 404) {
          console.error('Error fetching products:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [domain, collectionHandle, limit]);

  const gridColsMap: Record<number, string> = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };
  const gridColsClass = gridColsMap[columns] || 'sm:grid-cols-2 lg:grid-cols-4';

  if (loading) {
    return (
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container mx-auto px-5 sm:px-6">
          <div className="animate-pulse">
            <div className="h-8 w-48 mb-8 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
            <div className={`grid grid-cols-2 ${gridColsClass} gap-4 sm:gap-6`}>
              {[...Array(columns)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-lg" style={{ backgroundColor: 'var(--color-border)' }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show placeholder cards when no products and placeholders are not disabled
  const showPlaceholders = products.length === 0 && products_settings.showPlaceholders !== false;
  const placeholderCount = Math.min(limit, 8);

  if (products.length === 0 && !showPlaceholders) return null;

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <h2
            className="text-xl md:text-2xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            {heading}
          </h2>
          <Link
            href={getStorePermalink(domain, viewAllLink)}
            className="text-sm md:text-base font-medium transition-colors hover:opacity-70 flex items-center gap-1"
            style={{ color: 'var(--color-primary)' }}
          >
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </div>

        {/* Grid */}
        <div className={`grid grid-cols-2 ${gridColsClass} gap-3 sm:gap-5 md:gap-6`}>
          {products.length > 0
            ? products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  domain={domain}
                />
              ))
            : [...Array(placeholderCount)].map((_, i) => (
                <PlaceholderCard key={i} />
              ))
          }
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'featured-products',
  name: 'Featured Products',
  limit: 1,
  settings: [],
};

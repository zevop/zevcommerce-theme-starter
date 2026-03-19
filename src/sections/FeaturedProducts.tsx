'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme, getCollection, ProductCard, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

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
        <div className="container mx-auto px-4 sm:px-6">
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

  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            {heading}
          </h2>
          <Link
            href={getStorePermalink(domain, `/collections/${collectionHandle}`)}
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-primary)' }}
          >
            View All
          </Link>
        </div>

        {/* Grid */}
        <div className={`grid grid-cols-2 ${gridColsClass} gap-4 sm:gap-6`}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              domain={domain}
            />
          ))}
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

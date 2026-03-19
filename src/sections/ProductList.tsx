'use client';

import { useTheme, useCollection, ProductCard } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

export default function ProductList() {
  const { storeConfig } = useTheme();
  const { collection } = useCollection();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  if (!collection) {
    return (
      <div className="py-24 text-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 rounded mb-4" style={{ backgroundColor: 'var(--color-border)' }} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-auto px-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] rounded-lg" style={{ backgroundColor: 'var(--color-border)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const products = collection.products?.map((p: any) => p.product || p) || [];

  return (
    <section className="py-8 md:py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Collection Header */}
        <div className="mb-8 md:mb-10">
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: 'var(--color-text)' }}
          >
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-sm max-w-2xl" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
              {collection.description}
            </p>
          )}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                domain={domain}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
              No products found in this collection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'product-list',
  name: 'Product List',
  settings: [],
  disabled_on: { templates: ['*'] },
  enabled_on: { templates: ['collection'] },
};

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme, useProduct, useCartStore, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';
import { formatPrice } from '../helpers/format-price';

export default function ProductDetail() {
  const { theme, storeConfig } = useTheme();
  const { product, selectedVariant, quantity, setQuantity, setSelectedVariant } = useProduct();
  const { addItem, openCart } = useCartStore();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';
  const currency = storeConfig?.currency || 'NGN';

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setAddedToCart(false);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="py-24 text-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
          Product not found
        </p>
      </div>
    );
  }

  const images = product.media || [];
  const variants = product.variants || [];
  const hasVariants = variants.length > 1;

  const currentVariant = selectedVariant || variants[0];
  const price = parseFloat(currentVariant?.price || product.price || '0');
  const compareAtPrice = parseFloat(currentVariant?.compareAtPrice || product.compareAtPrice || '0');
  const isOnSale = compareAtPrice > 0 && compareAtPrice > price;

  // Group variant options
  const optionGroups: Record<string, string[]> = {};
  variants.forEach((v: any) => {
    (v.options || []).forEach((opt: any) => {
      if (!optionGroups[opt.name]) optionGroups[opt.name] = [];
      if (!optionGroups[opt.name].includes(opt.value)) {
        optionGroups[opt.name].push(opt.value);
      }
    });
  });

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addItem({
      variantId: currentVariant.id,
      productId: product.id,
      title: product.title,
      variantTitle: currentVariant.title || '',
      price: currentVariant.price,
      quantity,
      image: images[0]?.url || '',
      slug: product.slug,
    });
    setAddedToCart(true);
    openCart();
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <section className="py-8 md:py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
          <Link href={getStorePermalink(domain, '/')} className="hover:opacity-70 transition-opacity">Home</Link>
          <span>/</span>
          <Link href={getStorePermalink(domain, '/collections/all')} className="hover:opacity-70 transition-opacity">Products</Link>
          <span>/</span>
          <span style={{ opacity: 1, color: 'var(--color-text)' }}>{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            {images.length > 0 && (
              <div className="relative aspect-square mb-3 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-secondary)' }}>
                <img
                  src={images[activeImageIndex]?.url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {isOnSale && (
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded"
                    style={{ backgroundColor: 'var(--color-danger)', color: '#fff' }}
                  >
                    Sale
                  </span>
                )}
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    aria-label={`View image ${i + 1}`}
                    className="flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors"
                    style={{
                      borderColor: i === activeImageIndex ? 'var(--color-primary)' : 'transparent',
                    }}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Vendor */}
            {product.vendor && (
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-primary)' }}>
                {product.vendor}
              </p>
            )}

            {/* Title */}
            <h1
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: 'var(--color-text)' }}
            >
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                {formatPrice(price, currency)}
              </span>
              {isOnSale && (
                <span className="text-base line-through" style={{ color: 'var(--color-text)', opacity: 0.4 }}>
                  {formatPrice(compareAtPrice, currency)}
                </span>
              )}
            </div>

            {/* Variant Selectors */}
            {hasVariants && Object.entries(optionGroups).map(([optionName, values]) => {
              const currentValue = currentVariant?.options?.find((o: any) => o.name === optionName)?.value;
              return (
                <div key={optionName} className="mb-5">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    {optionName}: <span className="font-normal">{currentValue}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {values.map((val) => {
                      const isSelected = currentValue === val;
                      return (
                        <button
                          key={val}
                          onClick={() => {
                            const match = variants.find((v: any) =>
                              v.options?.some((o: any) => o.name === optionName && o.value === val)
                            );
                            if (match) setSelectedVariant(match);
                          }}
                          className="px-4 py-2 text-sm border rounded transition-colors"
                          style={{
                            backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                            color: isSelected ? '#fff' : 'var(--color-text)',
                            borderColor: isSelected ? 'var(--color-primary)' : '#d1d5db',
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Quantity
              </label>
              <div className="inline-flex items-center border rounded" style={{ borderColor: '#d1d5db' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--color-text)' }}
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--color-text)' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
            >
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </button>

            {/* Description */}
            {product.description && (
              <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                  Description
                </h3>
                <div
                  className="text-sm leading-relaxed prose prose-sm max-w-none"
                  style={{ color: 'var(--color-text)', opacity: 0.7 }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'product-detail',
  name: 'Product Detail',
  settings: [],
  disabled_on: { templates: ['*'] },
  enabled_on: { templates: ['product_detail'] },
};

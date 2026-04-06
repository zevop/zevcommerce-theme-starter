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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setAddedToCart(false);
    setLightboxOpen(false);
  }, [product?.id]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setLightboxOpen(false);
        if (e.key === 'ArrowLeft') setActiveImageIndex(i => Math.max(0, i - 1));
        if (e.key === 'ArrowRight') setActiveImageIndex(i => Math.min((product?.media?.length || 1) - 1, i + 1));
      };
      window.addEventListener('keydown', handler);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handler);
      };
    }
  }, [lightboxOpen, product?.media?.length]);

  if (!product) {
    return (
      <div className="py-24 text-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <p className="text-base" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
          Product not found
        </p>
      </div>
    );
  }

  const images = product.media || [];
  const variants = product.variants || [];
  const hasVariants = variants.length > 1;

  const currentVariant = selectedVariant || variants[0];
  const price = parseFloat(currentVariant?.price || '0');
  const compareAtPrice = parseFloat(currentVariant?.compareAtPrice || '0');
  const isOnSale = compareAtPrice > 0 && compareAtPrice > price;

  // Group options for display: prefer product.options (source of truth) when available,
  // otherwise derive from each variant's selectedOptions
  const optionGroups: Record<string, string[]> = {};
  const productOptions = (product as any).options;
  if (Array.isArray(productOptions) && productOptions.length > 0) {
    productOptions.forEach((opt: any) => {
      optionGroups[opt.name] = Array.isArray(opt.values) ? [...opt.values] : [];
    });
  } else {
    // Fallback: derive from variants' selectedOptions
    variants.forEach((v: any) => {
      (v.selectedOptions || []).forEach((opt: any) => {
        if (!optionGroups[opt.name]) optionGroups[opt.name] = [];
        if (!optionGroups[opt.name].includes(opt.value)) {
          optionGroups[opt.name].push(opt.value);
        }
      });
    });
  }

  // Multi-option variant selection: build the set of currently selected options,
  // update the clicked option, then find the variant that matches ALL selected options
  const handleOptionChange = (optionName: string, value: string) => {
    // Start from current variant's selectedOptions
    const currentOptions: Record<string, string> = {};
    (currentVariant?.selectedOptions || []).forEach((o: any) => {
      currentOptions[o.name] = o.value;
    });
    currentOptions[optionName] = value;

    // Find a variant that matches every selected option
    const match = variants.find((v: any) => {
      const vOpts = v.selectedOptions || [];
      return Object.entries(currentOptions).every(([name, val]) =>
        vOpts.some((o: any) => o.name === name && o.value === val)
      );
    });

    if (match) {
      setSelectedVariant(match);
    } else {
      // Fallback: find any variant that has at least the newly selected value
      const fallback = variants.find((v: any) =>
        v.selectedOptions?.some((o: any) => o.name === optionName && o.value === value)
      );
      if (fallback) setSelectedVariant(fallback);
    }
  };

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addItem({
      variantId: currentVariant.id,
      productId: product.id,
      title: product.title,
      variantTitle: currentVariant.title || '',
      price: parseFloat(currentVariant.price || '0'),
      quantity,
      image: images[0]?.url || null,
      slug: product.slug,
    });
    setAddedToCart(true);
    openCart();
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <section className="py-6 md:py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-5 sm:px-6 max-w-6xl">
        {/* Breadcrumb — mobile shows back link, desktop shows full trail */}
        <nav className="mb-6 md:mb-8" aria-label="Breadcrumb">
          {/* Mobile: back link to Products */}
          <Link
            href={getStorePermalink(domain, '/collections/')}
            className="md:hidden inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-text)', opacity: 0.7 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Products
          </Link>
          {/* Desktop: full trail */}
          <div className="hidden md:flex items-center gap-2 text-xs" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
            <Link href={getStorePermalink(domain, '/')} className="hover:opacity-70 transition-opacity">Home</Link>
            <span>/</span>
            <Link href={getStorePermalink(domain, '/collections/')} className="hover:opacity-70 transition-opacity">Products</Link>
            <span>/</span>
            <span className="truncate max-w-[320px]" style={{ opacity: 1, color: 'var(--color-text)' }}>{product.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            {images.length > 0 && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="View full image"
                className="group relative aspect-square w-full mb-3 rounded-lg overflow-hidden block cursor-zoom-in"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                <img
                  src={images[activeImageIndex]?.url}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {/* Zoom hint (desktop) */}
                <span
                  className="hidden md:flex absolute top-3 right-3 w-9 h-9 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </span>
                {isOnSale && (
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded"
                    style={{ backgroundColor: 'var(--color-danger, #ef4444)', color: '#ffffff' }}
                  >
                    Sale
                  </span>
                )}
              </button>
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
                      backgroundColor: 'var(--color-secondary)',
                      borderColor: i === activeImageIndex ? 'var(--color-primary)' : 'var(--color-border)',
                    }}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-contain" />
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
              const currentValue = currentVariant?.selectedOptions?.find((o: any) => o.name === optionName)?.value;
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
                          onClick={() => handleOptionChange(optionName, val)}
                          className="px-5 py-2 text-sm border rounded transition-colors min-h-[3rem]"
                          style={{
                            backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                            color: isSelected ? 'var(--color-background)' : 'var(--color-text)',
                            borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
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

            {/* Quantity + Add to Cart row */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                Quantity
              </label>
              <div className="flex items-stretch gap-3">
                {/* Quantity stepper */}
                <div
                  className="inline-flex items-center rounded-xl overflow-hidden shrink-0"
                  style={{
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background)',
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-11 h-12 flex items-center justify-center text-lg font-medium transition-opacity disabled:opacity-30"
                    style={{ color: 'var(--color-text)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <div
                    className="w-12 h-12 flex items-center justify-center text-sm font-semibold"
                    style={{
                      color: 'var(--color-text)',
                      borderLeft: '1px solid var(--color-border)',
                      borderRight: '1px solid var(--color-border)',
                    }}
                  >
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-11 h-12 flex items-center justify-center text-lg font-medium transition-opacity"
                    style={{ color: 'var(--color-text)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>

                {/* Add to Cart — visible on all viewports, always */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 px-6 text-sm font-semibold rounded-xl transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
                >
                  {addedToCart ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Added to cart
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                  Description
                </h3>
                <div
                  className="text-base leading-relaxed prose prose-sm max-w-none"
                  style={{ color: 'var(--color-text)', opacity: 0.7 }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.92)' }}
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            aria-label="Close"
            className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Image counter */}
          {images.length > 1 && (
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
            >
              {activeImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Previous */}
          {images.length > 1 && activeImageIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i => Math.max(0, i - 1)); }}
              aria-label="Previous image"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          )}

          {/* Next */}
          {images.length > 1 && activeImageIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i => Math.min(images.length - 1, i + 1)); }}
              aria-label="Next image"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          )}

          {/* Main image */}
          <img
            src={images[activeImageIndex]?.url}
            alt={product.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
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

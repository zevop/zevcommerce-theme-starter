'use client';

import Link from 'next/link';
import { useTheme, useCartStore, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';
import { formatPrice } from '../helpers/format-price';

export default function CartSection() {
  const { storeConfig } = useTheme();
  const { items, totalPrice, removeItem, updateQuantity } = useCartStore();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';
  const currency = storeConfig?.currency || 'NGN';

  const total = typeof totalPrice === 'function' ? totalPrice() : totalPrice;

  if (items.length === 0) {
    return (
      <div className="py-24 text-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container mx-auto px-5 sm:px-6">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--color-text)', opacity: 0.4 }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Your cart is empty
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
            Start browsing to add items to your cart.
          </p>
          <Link
            href={getStorePermalink(domain, '/collections/all')}
            className="btn-primary"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 md:py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-5 sm:px-6 max-w-4xl pb-32 lg:pb-0">
        <h1 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
          Your Cart
          <span className="text-base font-normal ml-2" style={{ opacity: 0.5 }}>
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>

        {/* Cart Items */}
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 py-6">
              {/* Image */}
              {item.image && (
                <Link
                  href={getStorePermalink(domain, `/products/${item.slug}`)}
                  className="flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                  />
                </Link>
              )}

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={getStorePermalink(domain, `/products/${item.slug}`)}
                  className="text-base font-medium hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--color-text)' }}
                >
                  {item.title}
                </Link>
                {item.variantTitle && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
                    {item.variantTitle}
                  </p>
                )}
                <p className="text-base font-semibold mt-2" style={{ color: 'var(--color-text)' }}>
                  {formatPrice(parseFloat(item.price) * item.quantity, currency)}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="inline-flex items-center border rounded text-sm" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                      onClick={() => updateQuantity(item.variantId, -1)}
                      aria-label="Decrease quantity"
                      className="min-w-[48px] min-h-[48px] transition-colors flex items-center justify-center"
                      style={{ color: 'var(--color-text)' }}
                    >
                      -
                    </button>
                    <span className="px-5 py-1" style={{ color: 'var(--color-text)' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, 1)}
                      aria-label="Increase quantity"
                      className="min-w-[48px] min-h-[48px] transition-colors flex items-center justify-center"
                      style={{ color: 'var(--color-text)' }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    aria-label={`Remove ${item.title}`}
                    className="text-xs font-medium transition-opacity hover:opacity-70 min-h-[44px] inline-flex items-center"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary (desktop only) */}
        <div className="hidden lg:block mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-6">
            <span className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
              Total
            </span>
            <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              {formatPrice(total, currency)}
            </span>
          </div>
          <Link
            href={getStorePermalink(domain, '/checkout')}
            className="btn-primary w-full text-center block py-3.5"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>

      {/* Sticky Checkout Bar (mobile only) */}
      <div className="lg:hidden">
        <div
          className="fixed bottom-16 left-0 right-0 z-40 px-5 pt-3 pb-2 backdrop-blur"
          style={{
            backgroundColor: 'var(--color-background)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
                Total
              </span>
              <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                {formatPrice(total, currency)}
              </span>
            </div>
            <Link
              href={getStorePermalink(domain, '/checkout')}
              className="h-14 flex-1 max-w-[240px] text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)' }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'cart-page',
  name: 'Cart Page',
  settings: [],
  disabled_on: { templates: ['*'] },
  enabled_on: { templates: ['cart'] },
};

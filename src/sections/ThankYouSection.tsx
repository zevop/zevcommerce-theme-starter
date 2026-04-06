'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme, useCartStore, getStorePermalink, getOrder } from '@zevcommerce/storefront-api';
import { useParams, useSearchParams } from 'next/navigation';

export default function ThankYouSection() {
  const { storeConfig } = useTheme();
  const params = useParams();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  const orderId = searchParams?.get('orderId') || searchParams?.get('order_id');
  const orderNumber = searchParams?.get('number') || searchParams?.get('orderNumber');
  const gcParam = searchParams?.get('gc');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(!!orderId);

  // Clear cart on mount — order was just placed
  useEffect(() => {
    clearCart();
  }, []);

  // Fetch order details if we have an orderId
  useEffect(() => {
    if (!orderId || !domain) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await getOrder(domain, orderId);
        setOrder(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, domain]);

  const giftCardCodes = gcParam ? gcParam.split(',').filter(Boolean) : [];
  const displayOrderNumber = orderNumber || order?.orderNumber || order?.number;

  return (
    <section
      className="min-h-[70vh] flex items-center justify-center py-12 md:py-20 px-5"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="w-full max-w-2xl mx-auto">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-success, #22c55e)' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-3xl md:text-4xl font-bold text-center mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          Thank you for your order!
        </h1>
        <p
          className="text-base text-center mb-8"
          style={{ color: 'var(--color-text)', opacity: 0.6 }}
        >
          {displayOrderNumber
            ? `Your order #${displayOrderNumber} has been received.`
            : 'Your order has been received.'}
        </p>

        {/* Order summary card */}
        {loading ? (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <p className="text-sm text-center" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
              Loading order details...
            </p>
          </div>
        ) : order ? (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
              Order Summary
            </h2>

            {order.customer?.email && (
              <div className="flex justify-between py-2 text-sm">
                <span style={{ color: 'var(--color-text)', opacity: 0.6 }}>Email</span>
                <span style={{ color: 'var(--color-text)' }}>{order.customer.email}</span>
              </div>
            )}

            {order.items?.length > 0 && (
              <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: 'var(--color-border)' }}>
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-start py-1.5">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                        {item.title}
                      </p>
                      {item.variantTitle && (
                        <p className="text-xs" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
                          {item.variantTitle}
                        </p>
                      )}
                      <p className="text-xs" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--color-text)' }}>
                      {storeConfig?.currencySymbol || ''}{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {order.total && (
              <div className="mt-3 pt-3 border-t flex justify-between" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>Total</span>
                <span className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {storeConfig?.currencySymbol || ''}{parseFloat(order.total).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        ) : null}

        {/* Gift card codes */}
        {giftCardCodes.length > 0 && (
          <div
            className="rounded-xl p-6 mb-6"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
              Your Gift Card Codes
            </h2>
            <div className="space-y-2">
              {giftCardCodes.map((code) => (
                <div
                  key={code}
                  className="font-mono text-sm px-3 py-2 rounded border"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {code}
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
              A copy has been sent to your email.
            </p>
          </div>
        )}

        {/* Info text */}
        <p
          className="text-sm text-center mb-8"
          style={{ color: 'var(--color-text)', opacity: 0.6 }}
        >
          A confirmation email has been sent to your inbox. We'll notify you when your order ships.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={getStorePermalink(domain, '/')}
            className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 min-h-[3rem]"
            style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
          >
            Continue Shopping
          </Link>
          <Link
            href={getStorePermalink(domain, '/collections/')}
            className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-lg border transition-colors hover:opacity-70 min-h-[3rem]"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'thank-you',
  name: 'Thank You Page',
  settings: [],
  disabled_on: { templates: ['*'] },
  enabled_on: { templates: ['thank_you'] },
};

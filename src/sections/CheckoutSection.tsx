'use client';

import { CheckoutForm, useTheme } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

export default function CheckoutSection() {
  const { storeConfig } = useTheme();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  if (!storeConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.5 }}>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-5 sm:px-6 py-8 md:py-16 max-w-4xl">
        <CheckoutForm domain={domain} store={storeConfig} />
      </div>
    </div>
  );
}

export const schema = {
  type: 'checkout-page',
  name: 'Checkout Page',
  settings: [],
  disabled_on: { templates: ['*'] },
  enabled_on: { templates: ['checkout'] },
};

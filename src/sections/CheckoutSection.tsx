'use client';

import { CheckoutForm } from '@zevcommerce/storefront-api';

export default function CheckoutSection() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-5 sm:px-6 py-8 md:py-16 max-w-4xl">
        <CheckoutForm />
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

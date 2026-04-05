'use client';

import { useTheme } from '@zevcommerce/storefront-api';

/**
 * Injects global CSS variables and base utility classes
 * derived from the theme's brand settings.
 */
export default function ThemeStyles() {
  const { theme } = useTheme();
  const brand = theme?.settings?.brand;

  const primary    = brand?.primary    || '#2563EB';
  const background = brand?.background || '#ffffff';
  const text       = brand?.text       || '#374151';
  const accent     = brand?.accent     || '#F59E0B';
  const border     = brand?.border     || '#e5e7eb';
  const secondary  = brand?.secondary  || '#f3f4f6';
  const fontBody   = brand?.font       || 'Inter';

  return (
    <style>{`
      :root {
        --color-primary: ${primary};
        --color-background: ${background};
        --color-text: ${text};
        --color-accent: ${accent};
        --color-border: ${border};
        --color-secondary: ${secondary};
        --color-danger: #ef4444;
        --color-success: #22c55e;
        --font-body: '${fontBody}', sans-serif;
        --font-heading: '${fontBody}', sans-serif;
      }

      body {
        background-color: var(--color-background);
        color: var(--color-text);
        font-family: var(--font-body);
        margin: 0;
      }

      *:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }

      input, textarea, select {
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        min-height: 3rem;
        background: var(--color-background);
        color: var(--color-text);
      }
      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
      }

      .container {
        width: 100%;
        max-width: 1280px;
        margin-left: auto;
        margin-right: auto;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
      }

      @media (min-width: 640px) {
        .container {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.875rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        min-height: 3.5rem;
        color: #ffffff;
        background-color: var(--color-primary);
        border: none;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: opacity 0.2s ease;
        text-decoration: none;
      }
      .btn-primary:hover {
        opacity: 0.9;
      }

      .btn-secondary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        min-height: 3rem;
        color: var(--color-text);
        background-color: transparent;
        border: 1px solid var(--color-border);
        border-radius: 0.75rem;
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease;
        text-decoration: none;
      }
      .btn-secondary:hover {
        background-color: var(--color-secondary);
      }
    `}</style>
  );
}

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
  const fontBody   = brand?.font       || 'Inter';

  return (
    <style>{`
      :root {
        --color-primary: ${primary};
        --color-background: ${background};
        --color-text: ${text};
        --color-accent: ${accent};
        --font-body: '${fontBody}', sans-serif;
      }

      body {
        background-color: var(--color-background);
        color: var(--color-text);
        font-family: var(--font-body);
        margin: 0;
      }

      .container {
        width: 100%;
        max-width: 1280px;
        margin-left: auto;
        margin-right: auto;
        padding-left: 1rem;
        padding-right: 1rem;
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
        padding: 0.75rem 1.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: #ffffff;
        background-color: var(--color-primary);
        border: none;
        border-radius: 6px;
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
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text);
        background-color: transparent;
        border: 1px solid var(--color-text);
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease;
        text-decoration: none;
      }
      .btn-secondary:hover {
        background-color: var(--color-text);
        color: var(--color-background);
      }
    `}</style>
  );
}

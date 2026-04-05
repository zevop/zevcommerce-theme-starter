'use client';

import Link from 'next/link';
import { useTheme, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

const DEFAULT_HEADING = 'Welcome to our store';
const DEFAULT_SUBHEADING = 'Discover amazing products at great prices.';

// Scoped responsive styles for the hero section spacing
const heroResponsiveCSS = `
.hero-section-wrapper {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 8px;
}
@media (min-width: 768px) {
  .hero-section-wrapper {
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 24px;
    padding-bottom: 32px;
  }
}
`;

export default function Hero() {
  const { theme, storeConfig } = useTheme();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  const hero = theme?.settings?.hero;
  if (!hero?.enabled) return null;

  const heading = hero.heading || DEFAULT_HEADING;
  const subheading = hero.subheading || '';
  const buttonText = hero.buttonText || 'Shop Now';
  const buttonLink = hero.buttonLink || '/collections/all';
  const textColor = hero.textColor || '#ffffff';

  const resolveImage = (img: any) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };

  const bgImage = resolveImage(hero.backgroundImage);
  const hasCustomGradient = hero.fallbackGradientStart && hero.fallbackGradientEnd;

  // Check if merchant has customized the hero beyond defaults
  const isCustomized = bgImage
    || hasCustomGradient
    || (hero.heading && hero.heading !== DEFAULT_HEADING)
    || (hero.subheading && hero.subheading !== DEFAULT_SUBHEADING);

  // Placeholder: shown when merchant hasn't customized yet
  if (!isCustomized) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: heroResponsiveCSS }} />
        <section className="hero-section-wrapper">
          <div
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '56px 24px',
            }}
          >
            {/* Image placeholder icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4d4d4"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p style={{ color: '#b0b0b0', fontSize: '14px', marginTop: '12px' }}>
              Add a hero image or customize your banner
            </p>
          </div>
        </section>
      </>
    );
  }

  // With image: background with overlay
  if (bgImage) {
    const overlayOpacity = (hero.overlayOpacity ?? 50) / 100;
    const overlayColor = hero.overlayColor || '#000000';

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: heroResponsiveCSS }} />
        <section className="hero-section-wrapper">
          <div
            className="relative flex items-center justify-center min-h-[50vh] md:min-h-[65vh] rounded-2xl overflow-hidden"
            style={{
              backgroundImage: `url("${bgImage}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
            />
            <div className="relative z-10 px-5 py-16 md:py-24 text-center">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
                style={{ color: textColor }}
              >
                {heading}
              </h1>
              {subheading && (
                <p
                  className="text-base sm:text-lg max-w-xl mx-auto mb-8 opacity-90"
                  style={{ color: textColor }}
                >
                  {subheading}
                </p>
              )}
              {buttonText && (
                <Link
                  href={getStorePermalink(domain, buttonLink)}
                  className="inline-flex items-center justify-center px-8 py-4 min-h-[3.5rem] text-base font-semibold rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#ffffff', color: '#111827' }}
                >
                  {buttonText}
                </Link>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }

  // Without image but customized: solid or gradient background
  const bgStyle = hasCustomGradient
    ? { background: `linear-gradient(135deg, ${hero.fallbackGradientStart}, ${hero.fallbackGradientEnd})` }
    : { backgroundColor: 'var(--color-primary)' };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroResponsiveCSS }} />
      <section className="hero-section-wrapper">
        <div
          className="rounded-2xl py-16 md:py-24"
          style={bgStyle}
        >
          <div className="px-5 text-center">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: textColor }}
            >
              {heading}
            </h1>
            {subheading && (
              <p
                className="text-base sm:text-lg max-w-xl mx-auto mb-8 opacity-80"
                style={{ color: textColor }}
              >
                {subheading}
              </p>
            )}
            {buttonText && (
              <Link
                href={getStorePermalink(domain, buttonLink)}
                className="inline-flex items-center justify-center px-8 py-4 min-h-[3.5rem] text-base font-semibold rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)' }}
              >
                {buttonText}
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export const schema = {
  type: 'hero',
  name: 'Hero Banner',
  limit: 1,
  settings: [],
};

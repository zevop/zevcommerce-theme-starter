'use client';

import Link from 'next/link';
import { useTheme, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

export default function Hero() {
  const { theme, storeConfig } = useTheme();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  const hero = theme?.settings?.hero;
  if (!hero?.enabled) return null;

  const heading = hero.heading || 'Welcome to our store';
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

  // With image: full-bleed background with overlay
  if (bgImage) {
    const overlayOpacity = (hero.overlayOpacity ?? 50) / 100;
    const overlayColor = hero.overlayColor || '#000000';

    return (
      <section
        className="relative flex items-center justify-center min-h-[50vh] md:min-h-[65vh]"
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
        <div className="relative z-10 container mx-auto px-5 py-16 md:py-24 text-center">
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
              className="inline-flex items-center justify-center px-8 py-4 min-h-[3.5rem] text-base font-semibold rounded-full transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
              style={{ backgroundColor: '#ffffff', color: '#111827' }}
            >
              {buttonText}
            </Link>
          )}
        </div>
      </section>
    );
  }

  // Without image: gradient or solid branded background
  const gradientStart = hero.fallbackGradientStart;
  const gradientEnd = hero.fallbackGradientEnd;
  const hasGradient = gradientStart && gradientEnd;

  const bgStyle = hasGradient
    ? { background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` }
    : { background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))` };

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={bgStyle}
    >
      {/* Subtle decorative shape */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
        style={{ backgroundColor: '#ffffff' }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.07]"
        style={{ backgroundColor: '#ffffff' }}
      />

      <div className="relative z-10 container mx-auto px-5 text-center">
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
            className="inline-flex items-center justify-center px-8 py-4 min-h-[3.5rem] text-base font-semibold rounded-full transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
            style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)' }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'hero',
  name: 'Hero Banner',
  limit: 1,
  settings: [],
};

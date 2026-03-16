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
  const overlayOpacity = (hero.overlayOpacity ?? 50) / 100;
  const overlayColor = hero.overlayColor || '#000000';
  const textColor = hero.textColor || '#ffffff';

  const resolveImage = (img: any) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };

  const bgImage = resolveImage(hero.backgroundImage);

  return (
    <section
      className="relative flex items-center justify-center min-h-[60vh] md:min-h-[75vh]"
      style={{
        backgroundImage: bgImage ? `url("${bgImage}")` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: !bgImage ? '#1f2937' : undefined,
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 text-center">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
          style={{ color: textColor }}
        >
          {heading}
        </h1>
        {subheading && (
          <p
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90"
            style={{ color: textColor }}
          >
            {subheading}
          </p>
        )}
        {buttonText && (
          <Link
            href={getStorePermalink(domain, buttonLink)}
            className="btn-primary inline-flex items-center px-6 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
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

'use client';

import Link from 'next/link';
import { useTheme, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

// Starter values that ship in preset.json. Kept here ONLY as a
// sentinel for `isCustomized` so we can tell "merchant hasn't touched
// the hero yet" from "merchant deliberately cleared it." They are NOT
// rendered — an empty heading stays empty.
const PRESET_HEADING = 'Welcome to our store';
const PRESET_SUBHEADING = 'Discover amazing products at great prices.';

// Scoped responsive styles for the hero section spacing. The
// `.hero-bg-image` rule swaps the background image below the md
// breakpoint when a merchant-uploaded mobile image is present — CSS
// custom props (set inline per-instance) feed both images in so a
// single shared class can serve every store. Falls back to the
// desktop image when `--hero-bg-mobile` is unset.
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
.hero-bg-image {
  background-image: var(--hero-bg-desktop);
  background-size: cover;
  background-position: center;
}
@media (max-width: 767px) {
  .hero-bg-image {
    background-image: var(--hero-bg-mobile, var(--hero-bg-desktop));
  }
}
`;

export default function Hero() {
  const { theme, storeConfig } = useTheme();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  const hero = theme?.settings?.hero;
  if (!hero?.enabled) return null;

  // Render merchant-entered values as-is. An empty heading stays
  // empty — NO fallback to the preset text — so merchants who clear
  // the field get an image-only or subheading-only banner.
  const heading = hero.heading || '';
  const subheading = hero.subheading || '';
  const buttonText = hero.buttonText || '';
  const buttonLink = hero.buttonLink || '/collections/all';
  const bannerLink = hero.bannerLink || '';
  const textColor = hero.textColor || '#ffffff';

  const resolveImage = (img: any) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };

  const bgImage = resolveImage(hero.backgroundImage);
  const mobileBgImage = resolveImage(hero.mobileBackgroundImage);
  const hasCustomGradient = hero.fallbackGradientStart && hero.fallbackGradientEnd;

  // Check if merchant has customized the hero beyond defaults. Compared
  // against PRESET_* so a first-time store (heading still equal to the
  // preset text) shows the placeholder, but a deliberately-cleared
  // heading does NOT — the presence of a bg image / subheading / the
  // banner link itself is enough signal the merchant is using the hero.
  const isCustomized = bgImage
    || hasCustomGradient
    || !!bannerLink
    || (hero.heading && hero.heading !== PRESET_HEADING)
    || (hero.subheading && hero.subheading !== PRESET_SUBHEADING);

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

  // If the merchant set a whole-banner link, the outer container
  // becomes a <Link> — the button (if any) then renders as a visual
  // span inside the link to avoid invalid nested <a> elements. When
  // the banner is clickable-whole, its inner button isn't a separate
  // navigation target; clicking anywhere goes to `bannerLink`.
  const renderButton = (buttonBg: string, buttonColor: string) => {
    if (!buttonText) return null;
    const classes =
      'inline-flex items-center justify-center px-8 py-4 min-h-[3.5rem] text-base font-semibold rounded-lg transition-opacity hover:opacity-90';
    const style = { backgroundColor: buttonBg, color: buttonColor };
    if (bannerLink) {
      return (
        <span className={classes} style={style}>
          {buttonText}
        </span>
      );
    }
    return (
      <Link href={getStorePermalink(domain, buttonLink)} className={classes} style={style}>
        {buttonText}
      </Link>
    );
  };

  const wrapBanner = (content: React.ReactNode) =>
    bannerLink ? (
      <Link
        href={getStorePermalink(domain, bannerLink)}
        className="block cursor-pointer no-underline"
      >
        {content}
      </Link>
    ) : (
      <>{content}</>
    );

  // With image: background with overlay
  if (bgImage) {
    const overlayOpacity = (hero.overlayOpacity ?? 50) / 100;
    const overlayColor = hero.overlayColor || '#000000';

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: heroResponsiveCSS }} />
        <section className="hero-section-wrapper">
          {wrapBanner(
            <div
              // Aspect-ratio-based sizing, NOT viewport-based. The
              // container's aspect exactly matches the recommended
              // image aspect at each breakpoint, so `background-size:
              // cover` never actually has anything to crop — the image
              // always fits perfectly. Mobile (<md) uses 9:10 portrait
              // to match 1080×1200 uploads; md+ uses ~24:13 landscape
              // to match 2400×1300 uploads.
              className="hero-bg-image relative flex items-center justify-center aspect-[9/10] md:aspect-[24/13] rounded-2xl overflow-hidden"
              style={{
                // CSS custom props feed both images in — the shared
                // @media rule swaps to the mobile image below 768px
                // when set, otherwise the desktop image is used at
                // every width (today's behavior).
                ['--hero-bg-desktop' as any]: `url("${bgImage}")`,
                ...(mobileBgImage
                  ? { ['--hero-bg-mobile' as any]: `url("${mobileBgImage}")` }
                  : {}),
              }}
            >
              <div
                className="absolute inset-0"
                style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
              />
              <div className="relative z-10 px-5 py-16 md:py-24 text-center">
                {heading && (
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
                    style={{ color: textColor }}
                  >
                    {heading}
                  </h1>
                )}
                {subheading && (
                  <p
                    className="text-base sm:text-lg max-w-xl mx-auto mb-8 opacity-90"
                    style={{ color: textColor }}
                  >
                    {subheading}
                  </p>
                )}
                {renderButton('#ffffff', '#111827')}
              </div>
            </div>,
          )}
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
        {wrapBanner(
          <div className="rounded-2xl py-16 md:py-24" style={bgStyle}>
            <div className="px-5 text-center">
              {heading && (
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
                  style={{ color: textColor }}
                >
                  {heading}
                </h1>
              )}
              {subheading && (
                <p
                  className="text-base sm:text-lg max-w-xl mx-auto mb-8 opacity-80"
                  style={{ color: textColor }}
                >
                  {subheading}
                </p>
              )}
              {renderButton('#ffffff', 'var(--color-primary)')}
            </div>
          </div>,
        )}
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

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

// Scoped responsive styles. Image swapping is native via `<picture>`
// inside each slide so we don't need a CSS-variable trick any more.
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
.hero-slides {
  position: relative;
}
.hero-slide {
  grid-area: 1 / 1;
  opacity: 0;
  transition: opacity 600ms ease-in-out;
  pointer-events: none;
}
.hero-slide.hero-slide--active {
  opacity: 1;
  pointer-events: auto;
}
`;

interface Slide {
  backgroundImage?: any;
  mobileBackgroundImage?: any;
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
  bannerLink?: string;
  textColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
}

function resolveImage(img: any): string | undefined {
  if (!img) return undefined;
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img.url) return img.url;
  return undefined;
}

// Preset text that ships in preset.json — used ONLY as a sentinel to
// detect "merchant hasn't touched the hero yet" vs "merchant cleared
// it deliberately". Never rendered directly.
const PRESET_HEADING = 'Welcome to our store';
const PRESET_SUBHEADING = 'Discover amazing products at great prices.';

export default function Hero() {
  const { theme, storeConfig } = useTheme();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  const hero = theme?.settings?.hero;

  // Normalize the incoming config. Prefer the multi-slide repeater
  // (`hero.slides`) — fall back to the legacy single-banner keys
  // (`hero.heading`, `hero.backgroundImage`, etc.) so stores created
  // before multi-slide support keep rendering. Computed before the
  // `enabled` guard so we can also use it in that check.
  const slides = useMemo<Slide[]>(() => {
    if (!hero) return [];
    const repeater: Slide[] = Array.isArray(hero.slides) ? hero.slides : [];
    if (repeater.length > 0) return repeater;

    const hasLegacy =
      resolveImage(hero.backgroundImage) ||
      (hero.heading && hero.heading !== PRESET_HEADING) ||
      (hero.subheading && hero.subheading !== PRESET_SUBHEADING);
    if (!hasLegacy) return [];

    return [
      {
        backgroundImage: hero.backgroundImage,
        mobileBackgroundImage: hero.mobileBackgroundImage,
        heading: hero.heading,
        subheading: hero.subheading,
        buttonText: hero.buttonText,
        buttonLink: hero.buttonLink,
        bannerLink: hero.bannerLink,
        textColor: hero.textColor,
        overlayColor: hero.overlayColor,
        overlayOpacity: hero.overlayOpacity,
      },
    ];
  }, [hero]);

  if (!hero?.enabled) return null;

  // Filter to "usable" slides — a slide needs at least an image or
  // some text to be worth rendering. Empty scaffold slides (merchant
  // clicked "Add slide" but didn't fill anything) are silently skipped.
  const usable = slides.filter(
    (s) => resolveImage(s.backgroundImage) || s.heading || s.subheading,
  );

  const hasCustomGradient =
    !!hero.fallbackGradientStart && !!hero.fallbackGradientEnd;

  // Placeholder: shown when merchant hasn't customized yet. Compared
  // against the preset sentinels so a first-time store (heading still
  // equal to the preset text, no bg image) shows the placeholder, but
  // a deliberately-cleared heading with any other signal does NOT.
  if (usable.length === 0 && !hasCustomGradient) {
    return <PlaceholderBanner />;
  }

  // No slides but merchant set a fallback gradient — render a single
  // text-only banner using the legacy global text / button fields.
  if (usable.length === 0 && hasCustomGradient) {
    return <GradientBanner hero={hero} domain={domain} />;
  }

  const autoplay = hero.autoplay !== false && usable.length > 1;
  const autoplayMs = Math.max(3, hero.autoplayInterval ?? 5) * 1000;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroResponsiveCSS }} />
      <section className="hero-section-wrapper">
        <Slideshow
          slides={usable}
          domain={domain}
          autoplay={autoplay}
          autoplayMs={autoplayMs}
        />
      </section>
    </>
  );
}

// ── Slideshow ────────────────────────────────────────────────────────────

function Slideshow({
  slides,
  domain,
  autoplay,
  autoplayMs,
}: {
  slides: Slide[];
  domain: string;
  autoplay: boolean;
  autoplayMs: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<any>(null);
  const count = slides.length;

  // Autoplay loop. Pauses when the user hovers or when the tab is
  // hidden — no point burning cycles rotating a banner nobody's
  // looking at.
  useEffect(() => {
    if (!autoplay || paused || count <= 1) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    timer.current = setTimeout(
      () => setIndex((i) => (i + 1) % count),
      autoplayMs,
    );
    return () => clearTimeout(timer.current);
  }, [autoplay, paused, count, autoplayMs, index]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // CSS grid stack + opacity fade = simpler than true carousel
  // translation and preserves each slide's own aspect ratio. The
  // container inherits its height from the currently-active slide's
  // image so the banner is exactly as tall as the image itself.
  return (
    <div
      className="hero-slides relative rounded-2xl overflow-hidden"
      style={{ display: 'grid' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide ${i === index ? 'hero-slide--active' : ''}`}
          aria-hidden={i !== index}
        >
          <SlideView slide={slide} domain={domain} />
        </div>
      ))}

      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Single slide ─────────────────────────────────────────────────────────

function SlideView({ slide, domain }: { slide: Slide; domain: string }) {
  const bg = resolveImage(slide.backgroundImage);
  const mobileBg = resolveImage(slide.mobileBackgroundImage);
  const heading = slide.heading || '';
  const subheading = slide.subheading || '';
  const buttonText = slide.buttonText || '';
  const buttonLink = slide.buttonLink || '/collections/all';
  const bannerLink = slide.bannerLink || '';
  const textColor = slide.textColor || '#ffffff';
  const overlayColor = slide.overlayColor || '#000000';
  const overlayOpacity = (slide.overlayOpacity ?? 40) / 100;

  const renderButton = () => {
    if (!buttonText) return null;
    const classes =
      'inline-flex items-center justify-center px-8 py-4 min-h-[3.5rem] text-base font-semibold rounded-lg transition-opacity hover:opacity-90';
    const style = { backgroundColor: '#ffffff', color: '#111827' };
    // When the whole banner is a link, render the button as a visual
    // span to avoid nested <a> which is invalid HTML.
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

  const content = (
    <>
      {bg ? (
        <picture className="block">
          {mobileBg && <source media="(max-width: 767px)" srcSet={mobileBg} />}
          {/* alt="" — hero image is decorative; heading/subheading carry meaning. */}
          <img src={bg} alt="" className="block w-full h-auto" loading="eager" />
        </picture>
      ) : (
        // Text-only slide. Use a neutral colored block sized by content.
        <div
          className="w-full py-16 md:py-24"
          style={{ backgroundColor: 'var(--color-primary, #2563EB)' }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-5 py-6 md:py-10 text-center">
        <div className="max-w-xl">
          {heading && (
            <h1
              className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight"
              style={{ color: textColor }}
            >
              {heading}
            </h1>
          )}
          {subheading && (
            <p
              className="text-sm sm:text-base md:text-lg mx-auto mb-4 md:mb-8 opacity-90"
              style={{ color: textColor }}
            >
              {subheading}
            </p>
          )}
          {renderButton()}
        </div>
      </div>
    </>
  );

  if (bannerLink) {
    return (
      <Link
        href={getStorePermalink(domain, bannerLink)}
        className="block relative cursor-pointer no-underline"
      >
        {content}
      </Link>
    );
  }

  return <div className="block relative">{content}</div>;
}

// ── Placeholder + legacy gradient banner ─────────────────────────────────

function PlaceholderBanner() {
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
            Add a hero slide or customize your banner
          </p>
        </div>
      </section>
    </>
  );
}

function GradientBanner({ hero, domain }: { hero: any; domain: string }) {
  const heading = hero.heading || '';
  const subheading = hero.subheading || '';
  const buttonText = hero.buttonText || '';
  const buttonLink = hero.buttonLink || '/collections/all';
  const bannerLink = hero.bannerLink || '';
  const textColor = hero.textColor || '#ffffff';
  const bgStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${hero.fallbackGradientStart}, ${hero.fallbackGradientEnd})`,
  };

  const renderButton = () => {
    if (!buttonText) return null;
    const classes =
      'inline-flex items-center justify-center px-8 py-4 min-h-[3.5rem] text-base font-semibold rounded-lg transition-opacity hover:opacity-90';
    const style = { backgroundColor: '#ffffff', color: 'var(--color-primary)' };
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

  const body = (
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
        {renderButton()}
      </div>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroResponsiveCSS }} />
      <section className="hero-section-wrapper">
        {bannerLink ? (
          <Link
            href={getStorePermalink(domain, bannerLink)}
            className="block cursor-pointer no-underline"
          >
            {body}
          </Link>
        ) : (
          body
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

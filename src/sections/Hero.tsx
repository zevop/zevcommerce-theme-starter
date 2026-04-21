'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

// ── Layout constants ─────────────────────────────────────────────────────
//
// The hero container uses a FIXED aspect ratio per breakpoint so the
// banner always looks like a banner — regardless of what the merchant
// uploads. The image itself is rendered with `object-fit: contain` so
// it is NEVER cropped; letterboxed areas are filled by a softly
// blurred, zoomed copy of the same image. This way:
//
//   - Non-designer merchants can upload any rectangular image and the
//     banner always has a respectable size + looks deliberate.
//   - Nothing important gets sliced off — the full image is always shown.
//   - Aspect mismatches produce a pleasant "frame" of the image's own
//     colors instead of stark letterbox bars.
//
// Aspect ratios chosen after looking at typical landing-page heroes:
//   - Mobile (<md): 5:4 (gentle landscape, portrait-ish — content reads)
//   - Desktop (≥md): 12:5 / 2.4:1 (cinematic — wide without being thin)
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

export default function Hero() {
  const { theme, storeConfig } = useTheme();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  const hero = theme?.settings?.hero;

  const slides = useMemo<Slide[]>(() => {
    if (!hero) return [];
    const repeater: Slide[] = Array.isArray(hero.slides) ? hero.slides : [];
    return repeater;
  }, [hero]);

  if (!hero?.enabled) return null;

  // Skip empty scaffold slides — a slide needs at least an image or
  // some text to be worth rendering.
  const usable = slides.filter(
    (s) => resolveImage(s.backgroundImage) || s.heading || s.subheading,
  );

  if (usable.length === 0) {
    return <PlaceholderBanner />;
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

  return (
    <div
      className="relative rounded-2xl overflow-hidden aspect-[5/4] md:aspect-[12/5] bg-gray-100"
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

// ── Slide view ───────────────────────────────────────────────────────────

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
    // If the whole banner is a link, render the button as a visual
    // span — nested <a> elements are invalid HTML.
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
        <>
          {/* Blurred, zoomed fill. Sits behind the contained image and
              softens any letterboxing into a natural-looking frame in
              the image's own colors. `alt=""` because this copy is
              purely decorative — the real image below carries meaning. */}
          <picture className="absolute inset-0 block">
            {mobileBg && <source media="(max-width: 767px)" srcSet={mobileBg} />}
            <img
              src={bg}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover scale-110 blur-2xl opacity-70"
            />
          </picture>

          {/* The actual image — contained so nothing is cropped. */}
          <picture className="absolute inset-0 flex items-center justify-center">
            {mobileBg && <source media="(max-width: 767px)" srcSet={mobileBg} />}
            <img
              src={bg}
              alt=""
              className="w-full h-full object-contain"
              loading="eager"
            />
          </picture>
        </>
      ) : (
        // Text-only slide: fall back to the theme's primary color so
        // the slide still looks like a deliberate banner.
        <div
          className="absolute inset-0"
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
        className="block relative w-full h-full cursor-pointer no-underline"
      >
        {content}
      </Link>
    );
  }

  return <div className="relative w-full h-full">{content}</div>;
}

// ── Placeholder ──────────────────────────────────────────────────────────

function PlaceholderBanner() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroResponsiveCSS }} />
      <section className="hero-section-wrapper">
        <div
          className="rounded-2xl aspect-[5/4] md:aspect-[12/5] flex flex-col items-center justify-center text-center"
          style={{ backgroundColor: '#f5f5f5' }}
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
            Add a hero slide to customize your banner
          </p>
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

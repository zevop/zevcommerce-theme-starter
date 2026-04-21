'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

// ── Layout ───────────────────────────────────────────────────────────────
//
// Rendering rules:
//
//   - Image slides use the IMAGE's natural aspect ratio. The frame's
//     width is capped by `hero.maxWidth` (default 1280) and the image
//     fills that width; its height auto-scales from intrinsic
//     dimensions. No crop, no letterbox — merchants see exactly what
//     they uploaded, same way the mobile layout already behaved.
//
//   - Text-only slides (no image) fall back to `hero.textOnlyHeight`
//     so an empty banner doesn't collapse to zero height.
//
//   - For a multi-slide carousel, each slide takes its own natural
//     height. The container sizes to the currently-visible slide so
//     transitions don't leave empty space.
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

function clampNumber(raw: any, min: number, max: number, fallback: number): number {
  const n = Number(raw);
  if (!isFinite(n) || n <= 0) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export default function Hero() {
  const { theme, storeConfig } = useTheme();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  const hero = theme?.settings?.hero ?? {};

  const slides = useMemo<Slide[]>(() => {
    const repeater: Slide[] = Array.isArray(hero.slides) ? hero.slides : [];
    return repeater;
  }, [hero]);

  if (hero.enabled === false) return null;

  const usable = slides.filter(
    (s) => resolveImage(s.backgroundImage) || s.heading || s.subheading,
  );

  const maxWidth = clampNumber(hero.maxWidth, 480, 1280, 1280);
  const textOnlyHeight = clampNumber(hero.textOnlyHeight, 200, 800, 420);

  if (usable.length === 0) {
    return <PlaceholderBanner maxWidth={maxWidth} textOnlyHeight={textOnlyHeight} />;
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
          maxWidth={maxWidth}
          textOnlyHeight={textOnlyHeight}
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
  maxWidth,
  textOnlyHeight,
}: {
  slides: Slide[];
  domain: string;
  autoplay: boolean;
  autoplayMs: number;
  maxWidth: number;
  textOnlyHeight: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<any>(null);
  const count = slides.length;

  useEffect(() => {
    if (!autoplay || paused || count <= 1) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    timer.current = setTimeout(() => setIndex((i) => (i + 1) % count), autoplayMs);
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
      className="relative mx-auto rounded-2xl overflow-hidden"
      style={{ maxWidth: `${maxWidth}px`, display: 'grid' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide ${i === index ? 'hero-slide--active' : ''}`}
          aria-hidden={i !== index}
        >
          <SlideView slide={slide} domain={domain} textOnlyHeight={textOnlyHeight} />
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

function SlideView({
  slide,
  domain,
  textOnlyHeight,
}: {
  slide: Slide;
  domain: string;
  textOnlyHeight: number;
}) {
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
        // Natural-aspect image: browser renders at the image's intrinsic
        // dimensions scaled to fit the frame's width. No crop, no
        // letterbox — the slide is exactly the aspect of the uploaded
        // image. Same behavior on mobile, where this "just works"
        // already because the container width is narrow and the image
        // shrinks to fit.
        <picture className="block">
          {mobileBg && <source media="(max-width: 767px)" srcSet={mobileBg} />}
          <img
            src={bg}
            alt=""
            className="block w-full h-auto"
            loading="eager"
          />
        </picture>
      ) : (
        // Text-only slide: fixed height so it reads as a banner rather
        // than a text block. Uses the theme's primary color as a
        // deliberate full-bleed background.
        <div
          style={{
            height: `${textOnlyHeight}px`,
            backgroundColor: 'var(--color-primary, #2563EB)',
          }}
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
        className="block relative w-full cursor-pointer no-underline"
      >
        {content}
      </Link>
    );
  }

  return <div className="relative w-full">{content}</div>;
}

// ── Placeholder ──────────────────────────────────────────────────────────

function PlaceholderBanner({
  maxWidth,
  textOnlyHeight,
}: {
  maxWidth: number;
  textOnlyHeight: number;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroResponsiveCSS }} />
      <section className="hero-section-wrapper">
        <div
          className="rounded-2xl flex flex-col items-center justify-center text-center mx-auto"
          style={{
            backgroundColor: '#f5f5f5',
            height: `${textOnlyHeight}px`,
            maxWidth: `${maxWidth}px`,
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

'use client';

import Link from 'next/link';
import { useTheme, resolveMenuUrl, getStorePermalink } from '@zevcommerce/storefront-api';
import { useParams } from 'next/navigation';

export default function Footer() {
  const { theme, storeConfig, menus } = useTheme();
  const params = useParams();
  const domain = (params?.domain as string) || storeConfig?.handle || '';

  const footer = theme?.settings?.footer;
  const storeName = storeConfig?.name || 'Store';
  const logoSrc = storeConfig?.storeLogo;

  const description = footer?.description || '';
  const menuHandle = footer?.menuHandle || 'footer';
  const copyright = footer?.copyright || `${new Date().getFullYear()} ${storeName}. All rights reserved.`;

  // Social links
  const socialLinks: Array<{ platform: string; url: string; icon: React.ReactNode }> = [];

  if (footer?.instagram) {
    socialLinks.push({
      platform: 'Instagram',
      url: footer.instagram,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      ),
    });
  }

  if (footer?.facebook) {
    socialLinks.push({
      platform: 'Facebook',
      url: footer.facebook,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    });
  }

  if (footer?.twitter) {
    socialLinks.push({
      platform: 'Twitter',
      url: footer.twitter,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    });
  }

  if (footer?.tiktok) {
    socialLinks.push({
      platform: 'TikTok',
      url: footer.tiktok,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.04a8.28 8.28 0 004.84 1.55V7.14a4.85 4.85 0 01-1.07-.45z" />
        </svg>
      ),
    });
  }

  // Footer menu
  const footerMenu = menus?.[menuHandle];
  const menuItems = (footerMenu as any)?.items || [];

  return (
    <footer
      className="py-12 md:py-16 pb-24 md:pb-16 border-t"
      style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
    >
      <div className="container mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand column */}
          <div>
            <Link href={getStorePermalink(domain, '/')} className="inline-block mb-4">
              {logoSrc ? (
                <img src={logoSrc} alt={storeName} className="h-8 w-auto object-contain" />
              ) : (
                <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{storeName}</span>
              )}
            </Link>
            {description && (
              <p className="text-base leading-relaxed max-w-xs" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                {description}
              </p>
            )}
            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 mt-5">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-text)', opacity: 0.5 }}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer menu */}
          {menuItems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text)' }}>
                Quick Links
              </h3>
              <nav aria-label="Footer navigation" className="flex flex-col">
                {menuItems.map((item: any) => (
                  <Link
                    key={item.id}
                    href={resolveMenuUrl(item, domain)}
                    className="text-base min-h-[44px] flex items-center transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-text)', opacity: 0.6 }}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* Store info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text)' }}>
              Store
            </h3>
            <div className="flex flex-col gap-2.5 text-base" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
              {storeConfig?.email && <p>{storeConfig.email}</p>}
              {storeConfig?.phone && <p>{storeConfig.phone}</p>}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text)', opacity: 0.4 }}>
            &copy; {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

export const schema = {
  type: 'footer',
  name: 'Footer',
  limit: 1,
  settings: [],
};

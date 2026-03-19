'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme, useCartStore, resolveMenuUrl, getStorePermalink, getProducts } from '@zevcommerce/storefront-api';
import { useRouter, useParams } from 'next/navigation';

export default function Header() {
  const { theme, storeConfig, menus } = useTheme();
  const { openCart, items } = useCartStore();
  const router = useRouter();
  const params = useParams();

  const header = theme?.settings?.header;
  const logoSrc = header?.logo || storeConfig?.storeLogo;
  const logoHeight = header?.logoHeight || 36;
  const sticky = header?.sticky !== false;
  const showSearch = header?.showSearch !== false;
  const menuHandle = header?.menuHandle || 'main-menu';

  const domain = (params?.domain as string) || storeConfig?.handle || '';
  const storeName = storeConfig?.name || 'Store';

  // Resolve menu
  const availableMenus = Object.values(menus || {});
  const defaultMenu = availableMenus.find((m: any) => m.isDefault);
  const activeMenu = (menuHandle && menus?.[menuHandle]) || defaultMenu || availableMenus[0];
  const menuItems = (activeMenu as any)?.items || [];

  // UI state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen]);

  // Focus search input
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Search suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const { data } = await getProducts(domain, 1, 5, searchQuery);
          setSuggestions(data);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, domain]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(getStorePermalink(domain, `/search?q=${encodeURIComponent(searchQuery)}`));
    setSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <>
      <header
        style={{
          backgroundColor: 'var(--color-background)',
          borderBottom: '1px solid var(--color-border)',
          position: sticky ? 'sticky' : 'relative',
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={getStorePermalink(domain, '/')} className="flex-shrink-0">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={storeName}
                  style={{ height: `${logoHeight}px`, width: 'auto', objectFit: 'contain' }}
                />
              ) : (
                <span
                  className="text-xl font-bold"
                  style={{ color: 'var(--color-text)' }}
                >
                  {storeName}
                </span>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {menuItems.map((item: any) => (
                <Link
                  key={item.id}
                  href={resolveMenuUrl(item, domain)}
                  className="text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: 'var(--color-text)' }}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              {showSearch && (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="p-2 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--color-text)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                aria-label="Cart"
                className="relative p-2 transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-text)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1"
                    style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="md:hidden p-2 transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-text)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-24"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); setSuggestions([]); } }}
        >
          <div className="w-full max-w-lg mx-4 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
            <form onSubmit={handleSearch} className="flex items-center px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3 flex-shrink-0" style={{ color: 'var(--color-text)', opacity: 0.4 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: 'var(--color-text)' }}
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSuggestions([]); setSearchQuery(''); }}
                aria-label="Close search"
                className="p-1 ml-2"
                style={{ color: 'var(--color-text)', opacity: 0.4 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </form>
            {suggestions.length > 0 && (
              <div className="max-h-80 overflow-y-auto">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    href={getStorePermalink(domain, `/products/${product.slug}`)}
                    onClick={() => { setSearchOpen(false); setSuggestions([]); setSearchQuery(''); }}
                    className="flex items-center gap-3 px-4 py-3 transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-secondary)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  >
                    {product.media?.[0]?.url && (
                      <img src={product.media[0].url} alt={product.title} className="w-10 h-10 object-cover rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{product.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[320px] flex flex-col"
            style={{ backgroundColor: 'var(--color-background)' }}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <Link href={getStorePermalink(domain, '/')} onClick={() => setMobileOpen(false)}>
                {logoSrc ? (
                  <img src={logoSrc} alt={storeName} style={{ height: '28px', width: 'auto' }} />
                ) : (
                  <span className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>{storeName}</span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-1"
                style={{ color: 'var(--color-text)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              {menuItems.map((item: any) => (
                <Link
                  key={item.id}
                  href={resolveMenuUrl(item, domain)}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-sm font-medium border-b transition-opacity hover:opacity-70"
                  style={{ color: 'var(--color-text)', borderColor: 'var(--color-secondary)' }}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export const schema = {
  type: 'header',
  name: 'Header',
  limit: 1,
  settings: [],
};

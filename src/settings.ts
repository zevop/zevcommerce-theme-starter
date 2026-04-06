import { defineSettings } from '@zevcommerce/theme-sdk';

export const settingsSchema = defineSettings([
  // ============================================================
  // BRAND
  // ============================================================
  {
    name: 'Brand',
    icon: 'palette',
    settings: [
      { type: 'color', id: 'brand.primary', label: 'Primary Color', default: '#2563EB' },
      { type: 'color', id: 'brand.background', label: 'Background Color', default: '#ffffff' },
      { type: 'color', id: 'brand.text', label: 'Text Color', default: '#374151' },
      { type: 'color', id: 'brand.accent', label: 'Accent Color', default: '#F59E0B' },
      { type: 'color', id: 'brand.border', label: 'Border Color', default: '#e5e7eb' },
      { type: 'color', id: 'brand.secondary', label: 'Secondary Background', default: '#f3f4f6' },
      {
        type: 'select',
        id: 'brand.font',
        label: 'Body Font',
        default: 'Inter',
        options: [
          { value: 'Inter', label: 'Inter' },
          { value: 'Roboto', label: 'Roboto' },
          { value: 'Open Sans', label: 'Open Sans' },
          { value: 'Poppins', label: 'Poppins' },
          { value: 'Lato', label: 'Lato' },
        ],
      },
    ],
  },

  // ============================================================
  // HEADER
  // ============================================================
  {
    name: 'Header',
    icon: 'layout',
    settings: [
      { type: 'image', id: 'header.logo', label: 'Logo Image' },
      { type: 'range', id: 'header.logoHeight', label: 'Logo Height (px)', min: 20, max: 80, step: 4, default: 36 },
      { type: 'image', id: 'header.favicon', label: 'Favicon (optional — defaults to logo)' },
      { type: 'checkbox', id: 'header.sticky', label: 'Sticky Header', default: true },
      { type: 'checkbox', id: 'header.showSearch', label: 'Show Search Icon', default: true },
      { type: 'link_list', id: 'header.menuHandle', label: 'Main Menu', default: 'main-menu' },
    ],
  },

  // ============================================================
  // HERO BANNER
  // ============================================================
  {
    name: 'Hero Banner',
    icon: 'image',
    settings: [
      { type: 'checkbox', id: 'hero.enabled', label: 'Show Hero', default: true },
      { type: 'image', id: 'hero.backgroundImage', label: 'Background Image' },
      { type: 'text', id: 'hero.heading', label: 'Heading', default: 'Welcome to our store' },
      { type: 'textarea', id: 'hero.subheading', label: 'Subheading', default: 'Discover amazing products at great prices.' },
      { type: 'text', id: 'hero.buttonText', label: 'Button Text', default: 'Shop Now' },
      { type: 'text', id: 'hero.buttonLink', label: 'Button Link', default: '/collections/all' },
      { type: 'range', id: 'hero.overlayOpacity', label: 'Overlay Opacity', min: 0, max: 100, step: 5, default: 50 },
      { type: 'color', id: 'hero.overlayColor', label: 'Overlay Color', default: '#000000' },
      { type: 'color', id: 'hero.textColor', label: 'Text Color', default: '#ffffff' },
      { type: 'color', id: 'hero.fallbackGradientStart', label: 'Fallback Gradient Start', show_if: 'hero.enabled' },
      { type: 'color', id: 'hero.fallbackGradientEnd', label: 'Fallback Gradient End', show_if: 'hero.enabled' },
    ],
  },

  // ============================================================
  // PRODUCTS
  // ============================================================
  {
    name: 'Products',
    icon: 'shopping-bag',
    settings: [
      { type: 'checkbox', id: 'products.enabled', label: 'Show Featured Products', default: true },
      { type: 'checkbox', id: 'products.showPlaceholders', label: 'Show Placeholders When Empty', default: true },
      { type: 'text', id: 'products.heading', label: 'Section Heading', default: 'Featured Products' },
      { type: 'collection_picker', id: 'products.collection', label: 'Collection', default: 'all' },
      { type: 'range', id: 'products.limit', label: 'Number of Products', min: 4, max: 24, step: 4, default: 8 },
      { type: 'text', id: 'products.viewAllLink', label: 'View All Link', default: '/collections/' },
      {
        type: 'select',
        id: 'products.columns',
        label: 'Grid Columns (Desktop)',
        default: '4',
        options: [
          { value: '2', label: '2 Columns' },
          { value: '3', label: '3 Columns' },
          { value: '4', label: '4 Columns' },
        ],
      },
    ],
  },

  // ============================================================
  // CONTACT
  // ============================================================
  {
    name: 'Contact',
    icon: 'phone',
    settings: [
      { type: 'checkbox', id: 'contact.enabled', label: 'Show Contact Section', default: false },
      { type: 'text', id: 'contact.heading', label: 'Section Heading', default: 'Get in Touch' },
      { type: 'checkbox', id: 'contact.showPhone', label: 'Show Phone', default: true },
      { type: 'text', id: 'contact.phone', label: 'Phone Number', default: '' },
      { type: 'checkbox', id: 'contact.showEmail', label: 'Show Email', default: true },
      { type: 'text', id: 'contact.email', label: 'Email Address', default: '' },
      { type: 'checkbox', id: 'contact.showWhatsApp', label: 'Show WhatsApp', default: false },
      { type: 'text', id: 'contact.whatsapp', label: 'WhatsApp Number', default: '' },
      { type: 'checkbox', id: 'contact.showAddress', label: 'Show Address', default: false },
      { type: 'textarea', id: 'contact.address', label: 'Address', default: '' },
    ],
  },

  // ============================================================
  // FOOTER
  // ============================================================
  {
    name: 'Footer',
    icon: 'align-bottom',
    settings: [
      { type: 'textarea', id: 'footer.description', label: 'Store Description', default: '' },
      { type: 'link_list', id: 'footer.menuHandle', label: 'Footer Menu', default: 'footer' },
      { type: 'text', id: 'footer.copyright', label: 'Copyright Text', default: '' },
      { type: 'text', id: 'footer.instagram', label: 'Instagram URL', default: '' },
      { type: 'text', id: 'footer.facebook', label: 'Facebook URL', default: '' },
      { type: 'text', id: 'footer.twitter', label: 'Twitter / X URL', default: '' },
      { type: 'text', id: 'footer.tiktok', label: 'TikTok URL', default: '' },
    ],
  },

  // ============================================================
  // ANNOUNCEMENT
  // ============================================================
  {
    name: 'Announcement',
    icon: 'megaphone',
    settings: [
      { type: 'checkbox', id: 'announcement.enabled', label: 'Show Announcement Bar', default: false },
      { type: 'text', id: 'announcement.text', label: 'Announcement Text', default: 'Free shipping on orders over $50!' },
      { type: 'color', id: 'announcement.backgroundColor', label: 'Background Color', default: '#2563EB' },
      { type: 'color', id: 'announcement.textColor', label: 'Text Color', default: '#ffffff' },
    ],
  },
]);

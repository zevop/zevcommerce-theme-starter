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
  // Single-banner settings are kept for backward compatibility with
  // stores created before multi-slide support — Hero.tsx falls back
  // to these if `hero.slides` is empty. New stores should use the
  // slides repeater below. The legacy fields render at the TOP so
  // existing merchants see their familiar controls first.
  {
    name: 'Hero Banner',
    icon: 'image',
    settings: [
      { type: 'checkbox', id: 'hero.enabled', label: 'Show Hero', default: true },

      { type: 'header', label: 'Slides' },
      {
        type: 'repeater',
        id: 'hero.slides',
        label: 'Slides',
        item_label: '{{heading}}',
        add_button_label: 'Add slide',
        max_items: 8,
        default: [],
        fields: [
          {
            type: 'image',
            id: 'backgroundImage',
            label: 'Image — any aspect ratio. Whatever you upload is the banner size.',
          },
          {
            type: 'image',
            id: 'mobileBackgroundImage',
            label: 'Mobile image (optional — used on phones when set)',
          },
          { type: 'text', id: 'heading', label: 'Heading', default: '' },
          { type: 'textarea', id: 'subheading', label: 'Subheading', default: '' },
          { type: 'text', id: 'buttonText', label: 'Button text (leave empty to hide)', default: '' },
          { type: 'text', id: 'buttonLink', label: 'Button link', default: '/collections/all' },
          {
            type: 'text',
            id: 'bannerLink',
            label: 'Banner link (optional — makes the whole slide clickable)',
            default: '',
          },
          { type: 'color', id: 'textColor', label: 'Text color', default: '#ffffff' },
          { type: 'color', id: 'overlayColor', label: 'Overlay color', default: '#000000' },
          { type: 'range', id: 'overlayOpacity', label: 'Overlay opacity', min: 0, max: 100, step: 5, default: 40 },
        ],
      },

      { type: 'header', label: 'Slideshow settings' },
      { type: 'checkbox', id: 'hero.autoplay', label: 'Auto-advance slides', default: true },
      {
        type: 'range',
        id: 'hero.autoplayInterval',
        label: 'Seconds per slide',
        min: 3,
        max: 10,
        step: 1,
        default: 5,
      },

      { type: 'header', label: 'Legacy (single-banner fallback)' },
      { type: 'paragraph', label: 'Only used when no slides are added above. New stores should use slides.' },
      { type: 'image', id: 'hero.backgroundImage', label: 'Background image' },
      { type: 'image', id: 'hero.mobileBackgroundImage', label: 'Mobile background image' },
      { type: 'text', id: 'hero.heading', label: 'Heading' },
      { type: 'textarea', id: 'hero.subheading', label: 'Subheading' },
      { type: 'text', id: 'hero.buttonText', label: 'Button text' },
      { type: 'text', id: 'hero.buttonLink', label: 'Button link' },
      { type: 'text', id: 'hero.bannerLink', label: 'Banner link' },
      { type: 'range', id: 'hero.overlayOpacity', label: 'Overlay opacity', min: 0, max: 100, step: 5, default: 50 },
      { type: 'color', id: 'hero.overlayColor', label: 'Overlay color', default: '#000000' },
      { type: 'color', id: 'hero.textColor', label: 'Text color', default: '#ffffff' },
      { type: 'color', id: 'hero.fallbackGradientStart', label: 'Fallback gradient start' },
      { type: 'color', id: 'hero.fallbackGradientEnd', label: 'Fallback gradient end' },
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

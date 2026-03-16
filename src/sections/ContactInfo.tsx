'use client';

import { useTheme } from '@zevcommerce/storefront-api';

export default function ContactInfo() {
  const { theme } = useTheme();
  const contact = theme?.settings?.contact;

  if (!contact?.enabled) return null;

  const heading = contact.heading || 'Get in Touch';
  const showPhone = contact.showPhone && contact.phone;
  const showEmail = contact.showEmail && contact.email;
  const showWhatsApp = contact.showWhatsApp && contact.whatsapp;
  const showAddress = contact.showAddress && contact.address;

  const hasItems = showPhone || showEmail || showWhatsApp || showAddress;
  if (!hasItems) return null;

  const cards: Array<{ icon: React.ReactNode; label: string; value: string; href?: string }> = [];

  if (showPhone) {
    cards.push({
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone}`,
    });
  }

  if (showEmail) {
    cards.push({
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
    });
  }

  if (showWhatsApp) {
    const waNumber = contact.whatsapp.replace(/[^0-9]/g, '');
    cards.push({
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      label: 'WhatsApp',
      value: contact.whatsapp,
      href: `https://wa.me/${waNumber}`,
    });
  }

  if (showAddress) {
    cards.push({
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: 'Address',
      value: contact.address,
    });
  }

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-10"
          style={{ color: 'var(--color-text)' }}
        >
          {heading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {cards.map((card, i) => {
            const content = (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-lg border transition-shadow hover:shadow-md"
                style={{ borderColor: '#e5e7eb' }}
              >
                <div
                  className="mb-3"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {card.icon}
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text)', opacity: 0.5 }}>
                  {card.label}
                </h3>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {card.value}
                </p>
              </div>
            );

            if (card.href) {
              return (
                <a key={i} href={card.href} target={card.label === 'WhatsApp' ? '_blank' : undefined} rel="noopener noreferrer">
                  {content}
                </a>
              );
            }
            return content;
          })}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'contact-info',
  name: 'Contact Info',
  limit: 1,
  settings: [],
};

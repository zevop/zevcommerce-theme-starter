'use client';

import { useTheme } from '@zevcommerce/storefront-api';

export default function Announcement() {
  const { theme } = useTheme();
  const announcement = theme?.settings?.announcement;

  if (!announcement?.enabled) return null;

  const text = announcement.text || 'Free shipping on orders over $50!';
  const backgroundColor = announcement.backgroundColor || '#2563EB';
  const textColor = announcement.textColor || '#ffffff';

  return (
    <div
      className="py-2.5 text-center"
      style={{ backgroundColor, color: textColor, fontFamily: 'var(--font-body)' }}
    >
      <p className="text-sm sm:text-base font-medium px-5">{text}</p>
    </div>
  );
}

export const schema = {
  type: 'announcement',
  name: 'Announcement Bar',
  limit: 1,
  settings: [],
};

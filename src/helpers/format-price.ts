/**
 * Currency-to-locale mapping for Intl.NumberFormat.
 */
const CURRENCY_LOCALES: Record<string, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  NGN: 'en-NG',
  GHS: 'en-GH',
  KES: 'en-KE',
  ZAR: 'en-ZA',
  CAD: 'en-CA',
  AUD: 'en-AU',
  JPY: 'ja-JP',
  INR: 'en-IN',
  BRL: 'pt-BR',
  MXN: 'es-MX',
  AED: 'ar-AE',
  SAR: 'ar-SA',
  XOF: 'fr-SN',
  XAF: 'fr-CM',
  TZS: 'en-TZ',
  UGX: 'en-UG',
  RWF: 'en-RW',
};

/**
 * Formats a numeric price into a localised currency string.
 *
 * @param amount  The price as a number or numeric string.
 * @param currency  ISO 4217 currency code (e.g. "NGN").
 * @returns  Formatted string, e.g. "NGN 1,500.00".
 */
export function formatPrice(amount: number | string, currency = 'NGN'): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(value)) return `${currency} 0.00`;

  const locale = CURRENCY_LOCALES[currency] || 'en-US';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

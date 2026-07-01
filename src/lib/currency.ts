/**
 * Global Currency & Formatting Configuration
 * Acting as the single source of truth for all financial layouts.
 */
export const CURRENCY_CONFIG = {
  locale: 'en-IN',
  currency: 'INR',
  symbol: '₹',
};

/**
 * Formats a numeric value into localized currency (e.g. ₹1,25,000.00).
 * Falls back safely to regex-based Indian numbering layout if Intl isn't fully supported.
 *
 * @param value - The numeric value to format
 * @param includeSymbol - Prepend the currency symbol (default: true)
 */
export function formatCurrency(value: number | null | undefined, includeSymbol: boolean = true): string {
  if (value === null || value === undefined || isNaN(value)) {
    return includeSymbol ? `${CURRENCY_CONFIG.symbol}0.00` : '0.00';
  }

  try {
    const formatter = new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: includeSymbol ? 'currency' : 'decimal',
      currency: CURRENCY_CONFIG.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(value);
  } catch {
    // Fail-safe manual formatting if locale is unsupported
    const formattedDec = value.toFixed(2);
    const parts = formattedDec.split('.');
    const numStr = parts[0];
    const decStr = parts[1];

    let lastThree = numStr.substring(numStr.length - 3);
    const otherThree = numStr.substring(0, numStr.length - 3);
    if (otherThree !== '') {
      lastThree = ',' + lastThree;
    }
    const formattedNum = otherThree.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + '.' + decStr;

    return includeSymbol ? `${CURRENCY_CONFIG.symbol}${formattedNum}` : formattedNum;
  }
}

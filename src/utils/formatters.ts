/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @param locale - The locale for formatting (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Parse a price string to a number
 * @param priceString - The price string to parse (e.g., "$245", "245", "$1,245")
 * @returns The parsed number
 */
export const parsePrice = (priceString: string): number => {
  // Remove currency symbols and commas
  const cleanedString = priceString.replace(/[^0-9.-]/g, '');
  return parseFloat(cleanedString) || 0;
};

/**
 * Format a number with commas
 * @param num - The number to format
 * @returns Formatted number string with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format view count with K, M abbreviations
 * @param count - The view count to format
 * @returns Formatted view count string (e.g., "1.2K", "2.5M")
 */
export const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toString();
};
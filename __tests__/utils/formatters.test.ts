import {
  formatCurrency,
  parsePrice,
  formatNumber,
  formatViewCount
} from '@/utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format amount as USD by default', () => {
      expect(formatCurrency(245)).toBe('$245');
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(0)).toBe('$0');
    });

    it('should format large amounts with commas', () => {
      expect(formatCurrency(1245)).toBe('$1,245');
      expect(formatCurrency(10000)).toBe('$10,000');
      expect(formatCurrency(1000000)).toBe('$1,000,000');
    });

    it('should handle different currencies', () => {
      expect(formatCurrency(100, 'EUR', 'de-DE')).toMatch(/100/);
      expect(formatCurrency(100, 'GBP', 'en-GB')).toMatch(/100/);
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-100)).toBe('-$100');
    });
  });

  describe('parsePrice', () => {
    it('should parse price strings with dollar sign', () => {
      expect(parsePrice('$245')).toBe(245);
      expect(parsePrice('$1,245')).toBe(1245);
    });

    it('should parse price strings without currency symbol', () => {
      expect(parsePrice('245')).toBe(245);
      expect(parsePrice('1245.99')).toBe(1245.99);
    });

    it('should parse price strings with commas', () => {
      expect(parsePrice('1,000')).toBe(1000);
      expect(parsePrice('$10,000,000')).toBe(10000000);
    });

    it('should return 0 for invalid input', () => {
      expect(parsePrice('')).toBe(0);
      expect(parsePrice('abc')).toBe(0);
    });

    it('should handle negative prices', () => {
      expect(parsePrice('-$100')).toBe(-100);
      expect(parsePrice('-100')).toBe(-100);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(100)).toBe('100');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1,000');
    });
  });

  describe('formatViewCount', () => {
    it('should format counts under 1000 as is', () => {
      expect(formatViewCount(0)).toBe('0');
      expect(formatViewCount(100)).toBe('100');
      expect(formatViewCount(999)).toBe('999');
    });

    it('should format counts 1000+ as K', () => {
      expect(formatViewCount(1000)).toBe('1K');
      expect(formatViewCount(1500)).toBe('1.5K');
      expect(formatViewCount(10000)).toBe('10K');
      expect(formatViewCount(999999)).toBe('1000K');
    });

    it('should format counts 1000000+ as M', () => {
      expect(formatViewCount(1000000)).toBe('1M');
      expect(formatViewCount(1500000)).toBe('1.5M');
      expect(formatViewCount(10000000)).toBe('10M');
    });

    it('should remove trailing .0', () => {
      expect(formatViewCount(1000)).toBe('1K');
      expect(formatViewCount(2000)).toBe('2K');
      expect(formatViewCount(1000000)).toBe('1M');
    });
  });
});

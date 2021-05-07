import { formatTokenValue, formatCurrencyValue } from '../utils/formatters';

describe('formatters', () => {
  describe('formatTokenValue', () => {
    it('formats an ETH value', async () => {
      expect(formatTokenValue(1999000000000000000, 18)).toBe('1.999');
    });

    it('formats a USDC value', async () => {
      expect(formatTokenValue(600000000, 6)).toBe('600');
    });
  });

  describe('formatCurrencyValue', () => {
    it('formats a USD value', async () => {
      expect(formatCurrencyValue(200025, 'USD')).toBe('$200,025.00');
    });

    it('formats a EUR value', async () => {
      expect(formatCurrencyValue(991, 'EUR')).toBe('€991.00');
    });
  });
});

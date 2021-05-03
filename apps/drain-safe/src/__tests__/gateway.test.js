import fetchJson from '../utils/fetch-json';
import { fetchSafeAssets } from '../utils/gateway';

jest.mock('../utils/fetch-json', () => jest.fn());

describe('Client Gateway functions', () => {
  describe('fetchSafeAssets', () => {
    it('fetches the safe balances on rinkeby', () => {
      fetchSafeAssets('0x123', 'rinkeby');
      expect(fetchJson).toHaveBeenCalledWith(
        'https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/0x123/balances/usd/?exclude_spam=true',
      );
    });

    it('fetches the safe balances on mainnet', () => {
      fetchSafeAssets('0x321', 'mainnet');
      expect(fetchJson).toHaveBeenCalledWith(
        'https://safe-transaction.mainnet.gnosis.io/api/v1/safes/0x321/balances/usd/?exclude_spam=true',
      );
    });
  });
});

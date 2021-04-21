import { fetchJson } from '../utils';
import { fetchSafeAssets } from '../utils/gateway';

jest.mock('../utils', () => ({
  fetchJson: jest.fn(),
}));

describe('Client Gateway functions', () => {
  describe('fetchSafeAssets', () => {
    it('fetches the safe balances on rinkeby', () => {
      fetchSafeAssets('0x123', 'rinkeby');
      expect(fetchJson).toHaveBeenCalledWith(
        'https://safe-client.rinkeby.gnosis.io/v1/safes/0x123/balances/USD/?trusted=false&exclude_spam=true',
      );
    });

    it('fetches the safe balances on mainnet', () => {
      fetchSafeAssets('0x321', 'mainnet');
      expect(fetchJson).toHaveBeenCalledWith(
        'https://safe-client.mainnet.gnosis.io/v1/safes/0x321/balances/USD/?trusted=false&exclude_spam=true',
      );
    });
  });
});

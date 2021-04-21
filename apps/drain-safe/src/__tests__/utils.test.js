import { fetchJson } from '../utils';

describe('Utils', () => {
  describe('fetchJson', () => {
    let originalFetch;
    beforeAll(() => {
      originalFetch = global.fetch;
    });
    afterAll(() => {
      global.fetch = originalFetch;
    });

    it('fetches JSON data', async () => {
      global.fetch = jest.fn((url) =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ balance: 1000, url }),
        }),
      );

      const testUrl = '/test';
      const data = await fetchJson(testUrl);

      expect(data.url).toBe(testUrl);
      expect(data.balance).toBe(1000);
    });

    it('throws when response is not ok', () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

      expect(fetchJson('/test')).rejects.toThrow('Network response was not ok');
    });
  });
});

const gnosisUrlByNetwork: {
  [key in number]: null | string;
} = {
  1: 'https://gnosis-safe.io/app/#',
  2: null,
  3: null,
  4: 'https://rinkeby.gnosis-safe.io/app/#',
  5: null,
  42: null,
  100: null,
  246: 'https://ewc.gnosis-safe.io/app/#',
  73799: 'https://volta.gnosis-safe.io/app/#',
};

export { gnosisUrlByNetwork };

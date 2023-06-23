export interface IERC20 {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
}

export const W_FIO_TOKEN: IERC20 = {
  address: process.env.REACT_APP_WRAPPED_FIO_TOKEN_CONTRACT_ADDRESS,
  symbol: 'wFIO',
  name: 'wFIO',
  decimals: 9,
};

export const W_FIO_DOMAIN_NFT: IERC20 = {
  address: process.env.REACT_APP_WRAPPED_FIO_DOMAIN_CONTRACT_ADDRESS,
  symbol: 'FIO',
  name: 'FIO',
  decimals: 0,
};

export const NETWORKS_LIST: {
  [key: string]: { name: string; currency: string; chainID: number };
} = {
  Ethereum: {
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    chainID: 1,
  },
  Rinkeby: {
    name: 'Rinkeby',
    currency: 'RIN',
    chainID: 4,
  },
  Goerli: {
    name: 'Goerli',
    currency: 'GOR',
    chainID: 5,
  },
  Polygon: {
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    chainID: 137,
  },
  Mumbai: {
    name: 'Ethereum Mainnet',
    currency: 'MATIC',
    chainID: 80001,
  },
  ArbitrumOne: {
    name: 'ArbitrumOne',
    currency: 'ARB1',
    chainID: 42161,
  },
  BinanceSmartChain: {
    name: 'Binance Smart Chain',
    currency: 'BSC',
    chainID: 56,
  },
  Avalanche: {
    name: 'Avalanche',
    currency: 'AVAX',
    chainID: 43114,
  },
  Fantom: {
    name: 'Fantom',
    currency: 'FTM',
    chainID: 250,
  },
};

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

export const NETWORKS_LIST = {
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
};

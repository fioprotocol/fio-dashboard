import { FIO_CHAIN_ID } from './fio';

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
    name: 'Polygon Testnet',
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

const MORALIS_DEFAULT_CHAIN_LIST = {
  43114: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    chainName: 'AVALANCHE',
  },
  250: {
    chainId: 250,
    name: 'Fantom',
    chainName: 'FANTOM',
  },
  25: {
    chainId: 25,
    name: 'Cronos',
    chainName: 'CRONOS',
  },
  11297108109: {
    chainId: 11297108109,
    name: 'Palm',
    chainName: 'PALM',
  },
  42161: {
    chainId: 42161,
    name: 'Arbitrum',
    chainName: 'ARBITRUM',
  },
};

const MORALIS_MULTIPLE_CHAIN_LIST = {
  [FIO_CHAIN_ID.MAINNET]: {
    1: {
      chainId: 1,
      name: 'Ethereum',
      chainName: 'ETHEREUM',
    },
    137: {
      chainId: 137,
      name: 'Polygon',
      chainName: 'POLYGON',
    },
    56: {
      chainId: 56,
      name: 'Binance Smart Chain',
      chainName: 'BSC',
    },
    100: {
      chainId: 100,
      name: 'Gnosis',
      chainName: 'GNOSIS',
    },
    88888: {
      chainId: 88888,
      name: 'Chiliz',
      chainName: 'CHILIZ',
    },
  },
  [FIO_CHAIN_ID.TESTNET]: {
    5: {
      chainId: 5,
      name: 'Ethereum Görli',
      chainName: 'GOERLI',
    },
    11155111: {
      chainId: 11155111,
      name: 'Ethereum Sepolia',
      chainName: 'SEPOLIA',
    },
    80001: {
      chainId: 80001,
      name: 'Polygon',
      chainName: 'MUMBAI',
    },
    97: {
      chainId: 97,
      name: 'Binance Smart Chain',
      chainName: 'BSC_TESTNET',
    },
    10200: {
      chainId: 10200,
      name: 'Gnosis',
      chainName: 'GNOSIS_CHIADO',
    },
    88882: {
      chainId: 88882,
      name: 'Chiliz',
      chainName: 'CHILIZ_SPICY',
    },
  },
};

export const MORALIS_CHAIN_LIST = {
  ...MORALIS_DEFAULT_CHAIN_LIST,
  ...MORALIS_MULTIPLE_CHAIN_LIST[process.env.REACT_APP_FIO_CHAIN_ID],
};

export const MORALIS_CHAIN_LIST_ARR = Object.values(MORALIS_CHAIN_LIST)
  .map(moralisChain => ({
    id: moralisChain.chainId.toString(),
    name: moralisChain.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

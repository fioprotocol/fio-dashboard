import { FIO_CHAIN_ID } from '../config/constants';

const MORALIS_DEFAULT_CHAIN_LIST = [
  {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    chainName: 'AVALANCHE',
  },
  {
    chainId: 250,
    name: 'Fantom',
    chainName: 'FANTOM',
  },
  {
    chainId: 25,
    name: 'Cronos',
    chainName: 'CRONOS',
  },
  {
    chainId: 11297108109,
    name: 'Palm',
    chainName: 'PALM',
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    chainName: 'ARBITRUM',
  },
];

const MORALIS_MULTIPLE_CHAIN_LIST = {
  [FIO_CHAIN_ID.MAINNET]: [
    {
      chainId: 1,
      name: 'Ethereum',
      chainName: 'ETHEREUM',
    },
    {
      chainId: 137,
      name: 'Polygon',
      chainName: 'POLYGON',
    },
    {
      chainId: 56,
      name: 'Binance Smart Chain',
      chainName: 'BSC',
    },
    {
      chainId: 100,
      name: 'Gnosis',
      chainName: 'GNOSIS',
    },
    {
      chainId: 88888,
      name: 'Chiliz',
      chainName: 'CHILIZ',
    },
  ],
  [FIO_CHAIN_ID.TESTNET]: [
    {
      chainId: 5,
      name: 'Ethereum Görli',
      chainName: 'GOERLI',
    },
    {
      chainId: 11155111,
      name: 'Ethereum Sepolia',
      chainName: 'SEPOLIA',
    },
    {
      chainId: 80001,
      name: 'Polygon',
      chainName: 'MUMBAI',
    },
    {
      chainId: 97,
      name: 'Binance Smart Chain',
      chainName: 'BSC_TESTNET',
    },
    {
      chainId: 10200,
      name: 'Gnosis',
      chainName: 'GNOSIS_CHIADO',
    },
    {
      chainId: 88882,
      name: 'Chiliz',
      chainName: 'CHILIZ_SPICY',
    },
  ],
};

export const MORALIS_CHAIN_LIST = [
  ...MORALIS_DEFAULT_CHAIN_LIST,
  ...MORALIS_MULTIPLE_CHAIN_LIST[process.env.FIO_CHAIN_ID],
];

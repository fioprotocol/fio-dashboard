import config from '../config';

const { wrap } = config || {};

export interface IERC20 {
  symbol: string;
  decimals: number;
  name: string;
}

export const W_FIO_TOKEN: IERC20 = {
  symbol: 'wFIO',
  name: 'wFIO',
  decimals: 9,
};

export const W_FIO_DOMAIN_NFT: IERC20 = {
  symbol: 'FIO',
  name: 'FIO',
  decimals: 0,
};

export const NETWORKS_LIST: {
  [key: string]: {
    name: string;
    chainCode: string;
    chainID: number;
    contractAddress?: string;
  };
} = {
  Ethereum: {
    name: 'Ethereum',
    chainCode: 'ETH',
    chainID: wrap.ETH.chainId,
    contractAddress: wrap.ETH.contractAddress,
  },
  Rinkeby: {
    name: 'Rinkeby',
    chainCode: 'RIN',
    chainID: 4,
  },
  Polygon: {
    name: 'Polygon',
    chainCode: 'POL',
    chainID: wrap.POLYGON.chainId,
    contractAddress: wrap.POLYGON.contractAddress,
  },
  ArbitrumOne: {
    name: 'ArbitrumOne',
    chainCode: 'ARB1',
    chainID: 42161,
  },
  BinanceSmartChain: {
    name: 'Binance Smart Chain',
    chainCode: 'BSC',
    chainID: 56,
  },
  Avalanche: {
    name: 'Avalanche',
    chainCode: 'AVAX',
    chainID: 43114,
  },
  Fantom: {
    name: 'Fantom',
    chainCode: 'FTM',
    chainID: 250,
  },
  Base: {
    name: 'Base',
    chainCode: 'BASE',
    chainID: wrap.BASE.chainId,
    contractAddress: wrap.BASE.contractAddress,
  },
};

export const MORALIS_CHAIN_LIST = [
  {
    chainId: 1,
    name: 'Ethereum',
    chainName: 'ETHEREUM',
  },
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
    chainId: 137,
    name: 'Polygon',
    chainName: 'POLYGON',
  },
  {
    chainId: 80001,
    name: 'Polygon Mumbai',
    chainName: 'MUMBAI',
  },
  { chainId: 80002, name: 'Polygon Amoy', chainName: 'POLYGON_AMOY' },
  {
    chainId: 56,
    name: 'Binance Smart Chain',
    chainName: 'BSC',
  },
  {
    chainId: 97,
    name: 'Binance Smart Chain Testnet',
    chainName: 'BSC_TESTNET',
  },
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

export const MORALIS_CHAIN_LIST_ARR = MORALIS_CHAIN_LIST.map(moralisChain => ({
  id: moralisChain.chainId.toString(),
  name: moralisChain.name,
})).sort((a, b) => a.name.localeCompare(b.name));

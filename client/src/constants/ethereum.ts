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
    name: 'Ethereum',
    currency: 'ETH',
    chainID: 1,
  },
  Rinkeby: {
    name: 'Rinkeby',
    currency: 'RIN',
    chainID: 4,
  },
  Sepolia: {
    name: 'Sepolia',
    currency: 'SETH',
    chainID: 11155111,
  },
  Polygon: {
    name: 'Polygon',
    currency: 'POL',
    chainID: 137,
  },
  Amoy: {
    name: 'Polygon Amoy',
    currency: 'POLYGON',
    chainID: 80002,
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
  BaseSepolia: {
    name: 'Base Sepolia',
    currency: 'BASE',
    chainID: 84532,
  },
  Base: {
    name: 'Base',
    currency: 'BASE',
    chainID: 8453,
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

import fs from 'fs';

import { WRAP_STATUS_NETWORKS, WRAP_STATUS_NETWORKS_IDS } from './constants.js';
import { CHAIN_CODES } from '../constants/chain.mjs';
import config from './index.mjs';

const WRAPPED_DOMAIN_ABI = JSON.parse(
  fs.readFileSync('server/static-files/abi_fio_domain_nft.json', 'utf8'),
);
const WRAPPED_TOKEN_ABI = JSON.parse(
  fs.readFileSync('server/static-files/abi_fio_token.json', 'utf8'),
);

export const CHAIN_TYPE = {
  EVM: 'evm',
  ANTELOPE: 'antelope',
};

export const ASSET_TYPE = {
  TOKEN: 'token',
  NFT: 'nft',
};

export const ACTION_TYPE = {
  WRAP: 'wrap',
  UNWRAP: 'unwrap',
  BURN: 'burn',
};

export const EVM_EVENT_NAME = {
  WRAP: 'wrapped',
  UNWRAP: 'unwrapped',
  BURN: 'domainburned',
  ORACLE_CONFIRMATION: 'consensus_activity',
};

/**
 * Chain configuration registry
 * To add a new chain: just add a new entry here with the same structure
 */
export const CHAINS_CONFIG = {
  [WRAP_STATUS_NETWORKS.ETH]: {
    id: WRAP_STATUS_NETWORKS_IDS.ETH,
    name: WRAP_STATUS_NETWORKS.ETH,
    chainCode: CHAIN_CODES.ETH,
    type: CHAIN_TYPE.EVM,
    assetType: ASSET_TYPE.TOKEN,
    rpcUrl: () => `${config.wrap.ethBaseUrl}${config.wrap.infuraApiKey}`,
    contract: {
      address: config.wrap.fioTokenEthContract,
      abi: WRAPPED_TOKEN_ABI,
    },
    events: {
      [ACTION_TYPE.WRAP]: EVM_EVENT_NAME.WRAP,
      [ACTION_TYPE.UNWRAP]: EVM_EVENT_NAME.UNWRAP,
      oracleConfirmation: EVM_EVENT_NAME.ORACLE_CONFIRMATION,
    },
    blocksRangeLimit: config.wrap.blocksRangeLimitEth,
    // Actions that require oracle confirmations
    requiresOracleConfirmation: [ACTION_TYPE.WRAP],
    firstBlockNumber: config.wrap.ethFirstBlockNumber,
  },
  [WRAP_STATUS_NETWORKS.BASE]: {
    id: WRAP_STATUS_NETWORKS_IDS.BASE,
    name: WRAP_STATUS_NETWORKS.BASE,
    chainCode: CHAIN_CODES.BASE,
    type: CHAIN_TYPE.EVM,
    assetType: ASSET_TYPE.TOKEN,
    rpcUrl: () => `${config.wrap.infuraBaseChainUrl}${config.wrap.infuraApiKey}`,
    contract: {
      address: config.wrap.fioTokenBaseContract,
      abi: WRAPPED_TOKEN_ABI,
    },
    events: {
      [ACTION_TYPE.WRAP]: EVM_EVENT_NAME.WRAP,
      [ACTION_TYPE.UNWRAP]: EVM_EVENT_NAME.UNWRAP,
      oracleConfirmation: EVM_EVENT_NAME.ORACLE_CONFIRMATION,
    },
    blocksRangeLimit: config.wrap.blocksRangeLimitBase,
    requiresOracleConfirmation: [ACTION_TYPE.WRAP],
    firstBlockNumber: config.wrap.baseFirstBlockNumber,
  },
  [WRAP_STATUS_NETWORKS.POLYGON]: {
    id: WRAP_STATUS_NETWORKS_IDS.POLYGON,
    name: WRAP_STATUS_NETWORKS.POLYGON,
    chainCode: CHAIN_CODES.MATIC, // Legacy support
    type: CHAIN_TYPE.EVM,
    assetType: ASSET_TYPE.NFT,
    rpcUrl: () => `${config.wrap.infuraPolygonBaseUrl}${config.wrap.infuraApiKey}`,
    contract: {
      address: config.wrap.fioNftPolygonContract,
      abi: WRAPPED_DOMAIN_ABI,
    },
    events: {
      [ACTION_TYPE.WRAP]: EVM_EVENT_NAME.WRAP,
      [ACTION_TYPE.UNWRAP]: EVM_EVENT_NAME.UNWRAP,
      [ACTION_TYPE.BURN]: EVM_EVENT_NAME.BURN,
      oracleConfirmation: EVM_EVENT_NAME.ORACLE_CONFIRMATION,
    },
    blocksRangeLimit: config.wrap.blocksRangeLimitPoly,
    requiresOracleConfirmation: [ACTION_TYPE.WRAP, ACTION_TYPE.BURN],
    firstBlockNumber: config.wrap.polygonFirstBlockNumber,
  },
  [WRAP_STATUS_NETWORKS.FIO]: {
    id: WRAP_STATUS_NETWORKS_IDS.FIO,
    name: WRAP_STATUS_NETWORKS.FIO,
    chainCode: CHAIN_CODES.FIO,
    type: CHAIN_TYPE.ANTELOPE,
    // FIO handles both tokens and NFTs, determined by action type
    assetType: null,
  },
};

/**
 * Get EVM chains configuration
 */
export const getEvmChains = () => {
  return Object.values(CHAINS_CONFIG).filter(chain => chain.type === CHAIN_TYPE.EVM);
};

/**
 * Get chain configuration by network name
 */
export const getChainConfig = networkName => {
  return CHAINS_CONFIG[networkName];
};

/**
 * Check if action requires oracle confirmation
 */
export const requiresOracleConfirmation = (networkName, actionType) => {
  const chain = CHAINS_CONFIG[networkName];
  return (
    (chain &&
      chain.requiresOracleConfirmation &&
      chain.requiresOracleConfirmation.includes(actionType)) ||
    false
  );
};

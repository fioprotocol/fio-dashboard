import {
  CHAIN_EXPLORER_CONFIG,
  CHAIN_CONFIG,
  OPERATION_TYPES,
  ASSET_TYPES,
  OPERATION_LABELS,
  ChainCode,
  OperationType,
  AssetType,
  PageParams,
} from './constants';

import config from '../../../config';

const { wrap } = config || {};

// Default explorer URLs (fallback)
const DEFAULT_EXPLORER_TX_URL = wrap.ETH.providerHistoryTxUrl;
const DEFAULT_EXPLORER_ADDRESS_URL = wrap.ETH.providerHistoryAddressUrl;

// Common params type for chain-related functions
type ChainQueryParams = {
  operationType: OperationType;
  assetType: AssetType;
};

// Chain options params type
type ChainOptionsParams = {
  chains: ChainCode[];
  includeAll?: boolean;
};

// Asset labels params type
type AssetLabelParams = {
  operationType: OperationType;
  assetType: AssetType;
};

// Title params type
type TitleParams = {
  operationType: OperationType;
  assetType: AssetType;
};

// Get explorer URL for a chain
export const getExplorerTxUrl = (chainCode: string | undefined): string => {
  if (!chainCode) return DEFAULT_EXPLORER_TX_URL || '';

  const upperChain = chainCode.toUpperCase() as ChainCode;
  const explorerConfig = CHAIN_EXPLORER_CONFIG[upperChain];

  return explorerConfig?.txUrl || DEFAULT_EXPLORER_TX_URL || '';
};

export const getExplorerAddressUrl = (
  chainCode: string | undefined,
): string => {
  if (!chainCode) return DEFAULT_EXPLORER_ADDRESS_URL || '';

  const upperChain = chainCode.toUpperCase() as ChainCode;
  const explorerConfig = CHAIN_EXPLORER_CONFIG[upperChain];

  return explorerConfig?.addressUrl || DEFAULT_EXPLORER_ADDRESS_URL || '';
};

// Get supported chains for a given operation and asset type
export const getSupportedChains = (params: ChainQueryParams): ChainCode[] => {
  const { operationType, assetType } = params;
  return CHAIN_CONFIG[operationType]?.[assetType] || [];
};

// Get default chain for operation/asset combination
export const getDefaultChain = (params: ChainQueryParams): ChainCode | null => {
  const chains = getSupportedChains(params);
  return chains.length > 0 ? chains[0] : null;
};

// Check if chain selection is needed (more than one chain available)
export const isChainSelectionEnabled = (params: ChainQueryParams): boolean => {
  return getSupportedChains(params).length > 1;
};

// Generate route key from page params (for navigation)
export const getRouteKeyFromParams = (params: PageParams): string | null => {
  const { operationType, assetType } = params;

  if (operationType === OPERATION_TYPES.BURNED) {
    return 'WRAP_STATUS_BURNED_DOMAINS';
  }

  const operationPart =
    operationType === OPERATION_TYPES.WRAP ? 'WRAP' : 'UNWRAP';
  const assetPart = assetType === ASSET_TYPES.TOKENS ? 'TOKENS' : 'DOMAINS';

  return `WRAP_STATUS_${operationPart}_${assetPart}`;
};

// Generate chain dropdown options from supported chains
export const getChainOptions = (
  params: ChainOptionsParams,
): { id: string; name: string }[] => {
  const { chains, includeAll = false } = params;

  const options = chains.map(chain => ({
    id: chain,
    name: chain,
  }));

  if (includeAll && chains.length > 1) {
    return [{ id: '', name: 'All' }, ...options];
  }

  return options;
};

// Get asset label based on operation and asset type
export const getAssetLabel = (params: AssetLabelParams): string => {
  const { operationType, assetType } = params;

  if (assetType === ASSET_TYPES.DOMAINS) {
    return 'FIO Domain';
  }

  // For tokens: "FIO" for wrap, "wFIO" for unwrap
  return operationType === OPERATION_TYPES.WRAP ? 'FIO' : 'wFIO';
};

// Get action title (for modals, headers)
export const getActionTitle = (params: TitleParams): string => {
  const { operationType } = params;
  const operationLabel = OPERATION_LABELS[operationType];
  const assetLabel = getAssetLabel(params);

  return `${operationLabel} ${assetLabel}`;
};

// Helper to get page title (plural form for list pages)
export const getPageTitle = (params: PageParams): string => {
  const { operationType, assetType } = params;

  if (operationType === OPERATION_TYPES.BURNED) {
    return 'Burned FIO Domains';
  }

  const operationLabel = OPERATION_LABELS[operationType];
  const assetLabel =
    assetType === ASSET_TYPES.TOKENS
      ? `${operationType === OPERATION_TYPES.WRAP ? '' : 'w'}FIO`
      : 'FIO Domains';

  return `${operationLabel} ${assetLabel}`;
};

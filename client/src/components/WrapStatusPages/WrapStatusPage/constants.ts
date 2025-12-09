import { WRAP_ITEM_STATUS } from '../../../constants/wrap';

import config from '../../../config';

const { wrap } = config || {};

// Chain codes - add new chains here when needed
export const WRAP_STATUS_CHAIN_CODES = {
  ETH: 'ETH',
  POL: 'POL',
  BASE: 'BASE',
} as const;

export type ChainCode = typeof WRAP_STATUS_CHAIN_CODES[keyof typeof WRAP_STATUS_CHAIN_CODES];

// Chain explorer configuration - add new chain explorers here
export const CHAIN_EXPLORER_CONFIG: Record<
  ChainCode,
  { txUrl: string | undefined; addressUrl: string | undefined }
> = {
  [WRAP_STATUS_CHAIN_CODES.ETH]: {
    txUrl: wrap.ETH.providerHistoryTxUrl,
    addressUrl: wrap.ETH.providerHistoryAddressUrl,
  },
  [WRAP_STATUS_CHAIN_CODES.POL]: {
    txUrl: wrap.POLYGON.providerHistoryTxUrl,
    addressUrl: wrap.POLYGON.providerHistoryAddressUrl,
  },
  [WRAP_STATUS_CHAIN_CODES.BASE]: {
    txUrl: wrap.BASE.providerHistoryTxUrl,
    addressUrl: wrap.BASE.providerHistoryAddressUrl,
  },
};

// Operation types
export const OPERATION_TYPES = {
  WRAP: 'wrap',
  UNWRAP: 'unwrap',
  BURNED: 'burned',
} as const;

export type OperationType = typeof OPERATION_TYPES[keyof typeof OPERATION_TYPES];

// Asset types
export const ASSET_TYPES = {
  TOKENS: 'tokens',
  DOMAINS: 'domains',
} as const;

export type AssetType = typeof ASSET_TYPES[keyof typeof ASSET_TYPES];

// Chain configuration per operation/asset combination
// This makes it easy to add new chains - just update the arrays below
export const CHAIN_CONFIG: Record<
  OperationType,
  Record<AssetType, ChainCode[]>
> = {
  [OPERATION_TYPES.WRAP]: {
    [ASSET_TYPES.TOKENS]: [
      WRAP_STATUS_CHAIN_CODES.ETH,
      WRAP_STATUS_CHAIN_CODES.BASE,
    ],
    [ASSET_TYPES.DOMAINS]: [WRAP_STATUS_CHAIN_CODES.POL],
  },
  [OPERATION_TYPES.UNWRAP]: {
    [ASSET_TYPES.TOKENS]: [
      WRAP_STATUS_CHAIN_CODES.ETH,
      WRAP_STATUS_CHAIN_CODES.BASE,
    ],
    [ASSET_TYPES.DOMAINS]: [WRAP_STATUS_CHAIN_CODES.POL],
  },
  [OPERATION_TYPES.BURNED]: {
    [ASSET_TYPES.TOKENS]: [],
    [ASSET_TYPES.DOMAINS]: [WRAP_STATUS_CHAIN_CODES.POL],
  },
};

// Page params configuration - used to map URL routes to page state
export type PageParams = {
  operationType: OperationType;
  assetType: AssetType;
  chainCode: ChainCode | null;
};

// Default page params
export const DEFAULT_PAGE_PARAMS: PageParams = {
  operationType: OPERATION_TYPES.WRAP,
  assetType: ASSET_TYPES.TOKENS,
  chainCode: WRAP_STATUS_CHAIN_CODES.ETH,
};

// Route to page params mapping
export const ROUTE_TO_PAGE_PARAMS: Record<string, PageParams> = {
  WRAP_STATUS_WRAP_TOKENS: {
    operationType: OPERATION_TYPES.WRAP,
    assetType: ASSET_TYPES.TOKENS,
    chainCode: WRAP_STATUS_CHAIN_CODES.ETH,
  },
  WRAP_STATUS_UNWRAP_TOKENS: {
    operationType: OPERATION_TYPES.UNWRAP,
    assetType: ASSET_TYPES.TOKENS,
    chainCode: WRAP_STATUS_CHAIN_CODES.ETH,
  },
  WRAP_STATUS_WRAP_DOMAINS: {
    operationType: OPERATION_TYPES.WRAP,
    assetType: ASSET_TYPES.DOMAINS,
    chainCode: WRAP_STATUS_CHAIN_CODES.POL,
  },
  WRAP_STATUS_UNWRAP_DOMAINS: {
    operationType: OPERATION_TYPES.UNWRAP,
    assetType: ASSET_TYPES.DOMAINS,
    chainCode: WRAP_STATUS_CHAIN_CODES.POL,
  },
  WRAP_STATUS_BURNED_DOMAINS: {
    operationType: OPERATION_TYPES.BURNED,
    assetType: ASSET_TYPES.DOMAINS,
    chainCode: WRAP_STATUS_CHAIN_CODES.POL,
  },
};

// Dropdown options for operation type
export const WRAP_TYPE_FILTER_OPTIONS = [
  { id: OPERATION_TYPES.WRAP, name: 'WRAP' },
  { id: OPERATION_TYPES.UNWRAP, name: 'UNWRAP' },
  { id: OPERATION_TYPES.BURNED, name: 'BURN' },
];

// Dropdown options for asset type
export const WRAP_ASSETS_FILTER_OPTIONS = [
  { id: ASSET_TYPES.TOKENS, name: 'TOKENS' },
  { id: ASSET_TYPES.DOMAINS, name: 'DOMAINS' },
];

// Date filter names
export const WRAP_DATE_FILTER_NAMES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST7DAYS: 'last7days',
  LASTMONTH: 'lastMonth',
  LASTHALFOFYEAR: 'lastHalfOfYear',
};

// Date filter dropdown options
export const WRAP_DATE_FILTER_OPTIONS = [
  {
    id: '',
    name: 'All',
  },
  {
    id: WRAP_DATE_FILTER_NAMES.TODAY,
    name: 'Today',
  },
  {
    id: WRAP_DATE_FILTER_NAMES.YESTERDAY,
    name: 'Yesterday',
  },
  {
    id: WRAP_DATE_FILTER_NAMES.LAST7DAYS,
    name: 'Last 7 days',
  },
  {
    id: WRAP_DATE_FILTER_NAMES.LASTMONTH,
    name: 'Last month',
  },
  {
    id: WRAP_DATE_FILTER_NAMES.LASTHALFOFYEAR,
    name: 'Last half year',
  },
  {
    id: 'custom',
    name: 'Custom Dates',
  },
];

// Wrap item status content
export const WRAP_ITEM_STATUS_NAME = {
  PENDING: 'Pending',
  FAILED: 'Failed',
  COMPLETE: 'Complete',
};

export const WRAP_STATUS_CONTENT: Record<
  string,
  { text: string; type: string }
> = {
  [WRAP_ITEM_STATUS_NAME.COMPLETE]: {
    text: WRAP_ITEM_STATUS.COMPLETE,
    type: 'primary',
  },
  [WRAP_ITEM_STATUS_NAME.FAILED]: {
    text: WRAP_ITEM_STATUS.PENDING,
    type: 'secondary',
  },
  [WRAP_ITEM_STATUS_NAME.PENDING]: {
    text: WRAP_ITEM_STATUS.PENDING,
    type: 'secondary',
  },
};

// Export "All" chain option constant
export const EXPORT_ALL_CHAINS = '';

// Operation labels configuration
export const OPERATION_LABELS: Record<OperationType, string> = {
  [OPERATION_TYPES.WRAP]: 'Wrap',
  [OPERATION_TYPES.UNWRAP]: 'Unwrap',
  [OPERATION_TYPES.BURNED]: 'Burn',
};

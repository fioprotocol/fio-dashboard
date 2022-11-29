import { ROUTES } from './routes';
import { NFTTokenItemProps } from '../types';

export const USER_STATUSES = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  NEW_EMAIL_NOT_VERIFIED: 'NEW_EMAIL_NOT_VERIFIED',
};

export const ADMIN_USER_STATUSES = {
  NEW: 1,
  ACTIVE: 2,
  BLOCKED: 3,
  NEW_EMAIL_NOT_VERIFIED: 4,
};

export const ADMIN_USER_ROLES = {
  ADMIN: 1,
  SUPER_ADMIN: 2,
};

export const DEFAULT_WALLET_OPTIONS = {
  name: 'My FIO Wallet',
  fiatCurrencyCode: 'iso:USD',
};
export const FIO_WALLET_TYPE = 'wallet:fio';

// Key name should be the same as confirm pin or ledger action
export const ANALYTICS_EVENT_ACTIONS = {
  REMOVE_ITEM_FROM_CART: 'remove_from_cart',
  ADD_ITEM_TO_CART: 'add_to_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PRICE_CHANGE: 'price_change',
  PURCHASE_STARTED: 'purchase_started',
  PURCHASE_FINISHED: 'purchase',
  PURCHASE_FINISHED_PARTIAL: 'purchase_partial',
  PURCHASE_FINISHED_FAILED: 'purchase_error',
  SEARCH_ITEM: 'search',
  SEARCH_ITEM_ALREADY_USED: 'search_not_available',
  RENEW: 'fio_domain_renew',
  TRANSFER: 'fio_transfer',
  TRANSFER_DOMAIN: 'fio_domain_transfer',
  TRANSFER_FCH: 'fch_transfer',
  SET_VISIBILITY: 'fio_domain_status',
  ADD_BUNDLES: 'fch_add_bundles',
  PAYMENT_DETAILS: 'fio_data_new',
  SEND: 'token_send',
  REQUEST: 'fio_request_new',
  REJECT_FIO_REQUEST: 'fio_request_reject',
  STAKE: 'token_stake',
  UNSTAKE: 'token_unstake',
  SIGN_NFT: 'fch_sign_nft',
  NFT_VALIDATE: 'nft_validate',
  ADD_TOKEN: 'fch_link_token',
  CREATE_WALLET: 'wallet_create',
  CART_EMPTIED: 'cart_emptied',
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  ENABLE_TWO_FACTOR: 'sec_2fa',
  RECOVERY: 'sec_recovery',
  PAGE_VIEW: 'page_view',
  VIRTUAL_PAGE_VIEW: 'virtual_page_view',
  CHAIN_ERROR: 'chain_error',
  AFFILIATE_ENABLED: 'affiliate_enabled',
};

export const CONFIRM_FIO_ACTIONS = {
  PURCHASE: 'PURCHASE',
  TRANSFER: 'TRANSFER',
  SET_VISIBILITY: 'SET_VISIBILITY',
  RENEW: 'RENEW',
  SIGN_NFT: 'SIGN_NFT',
  SEND: 'SEND',
  REQUEST: 'REQUEST',
  PAYMENT_DETAILS: 'PAYMENT_DETAILS',
  ADD_BUNDLES: 'ADD_BUNDLES',
  ADD_TOKEN: 'ADD_TOKEN',
  DELETE_TOKEN: 'DELETE_TOKEN',
  EDIT_TOKEN: 'EDIT_TOKEN',
  REJECT_FIO_REQUEST: 'REJECT_FIO_REQUEST',
  STAKE: 'STAKE',
  UNSTAKE: 'UNSTAKE',
  REGISTER_ADDRESS_PRIVATE_DOMAIN: 'REGISTER_ADDRESS_PRIVATE_DOMAIN',
};

export const CONFIRM_LEDGER_ACTIONS = {
  CREATE_WALLET: 'CREATE_WALLET',
  VIEW_PUB_ADDRESS: 'VIEW_PUB_ADDRESS',
  ...CONFIRM_FIO_ACTIONS,
};

export const CONFIRM_PIN_ACTIONS = {
  RECOVERY: 'RECOVERY',
  RESEND_EMAIL: 'RESEND_EMAIL',
  DISABLE_PASSWORD_RECOVERY: 'DISABLE_PASSWORD_RECOVERY',
  CREATE_WALLET: 'CREATE_WALLET',
  IMPORT_WALLET: 'IMPORT_WALLET',
  UPDATE_EMAIL: 'UPDATE_EMAIL',
  DISABLE_TWO_FACTOR: 'DISABLE_TWO_FACTOR',
  ENABLE_TWO_FACTOR: 'ENABLE_TWO_FACTOR',
  TWO_FACTOR_REQUEST: 'TWO_FACTOR_REQUEST',
  SHOW_BACKUP_CODE: 'SHOW_BACKUP_CODE',
  DETAILED_FIO_REQUEST: 'DETAILED_FIO_REQUEST',
  ...CONFIRM_FIO_ACTIONS,
};

export const ADDRESS = 'address';
export const DOMAIN = 'domain';

export const DOMAIN_STATUS = {
  PRIVATE: 'private',
  PUBLIC: 'public',
};

export const MANAGE_PAGE_REDIRECT = {
  address: ROUTES.FIO_ADDRESSES,
  domain: ROUTES.FIO_DOMAINS,
};

export const DEFAULT_FIO_TRX_ERR_MESSAGE =
  'Your purchase has failed due to an error. Your funds remain in your account and your registrations did not complete. Please try again later.';

export const NFT_TOKEN_ITEM_PROPS_ORDER: NFTTokenItemProps[] = [
  'fioAddress',
  'chainCode',
  'tokenId',
  'contractAddress',
  'hash',
  'url',
  'metadata',
];

export const WALLET_CREATED_FROM = {
  EDGE: 'EDGE',
  LEDGER: 'LEDGER',
};

export const NFT_CHAIN_CODE_LIST = [
  { id: 'ALGO', name: 'Algorand' },
  { id: 'BSC', name: 'Binance Smart Chain' },
  { id: 'ADA', name: 'Cardano' },
  { id: 'DGB', name: 'DigiByte' },
  { id: 'EOS', name: 'EOS' },
  { id: 'ETH', name: 'Ethereum' },
  { id: 'FLOW', name: 'Flow' },
  { id: 'MATIC', name: 'Polygon' },
  { id: 'SOL', name: 'Solana' },
  { id: 'XTZ', name: 'TEZOS' },
  { id: 'THETA', name: 'THETA' },
  { id: 'TRX', name: 'TRON' },
  { id: 'WAX', name: 'WAXP' },
];

export const CHAIN_CODES = {
  FIO: 'FIO',
  BTC: 'BTC',
  ETH: 'ETH',
};

export const CURRENCY_CODES = {
  FIO: 'FIO',
  USDC: 'USDC',
  USD: 'USD',
} as const;

export const FIO_DATA_TRANSACTION_LINK = {
  [CHAIN_CODES.FIO]: process.env.REACT_APP_FIO_BLOCKS_TX_URL,
  [CHAIN_CODES.BTC]: 'https://blockchair.com/bitcoin/transaction/',
  [CHAIN_CODES.ETH]: 'https://etherscan.io/tx/',
};

export const DEFAULT_TEXT_TRUNCATE_LENGTH = 5;

export const US_LOCALE = 'en-US';

export const ANALYTICS_FIO_NAME_TYPE = {
  ADDRESS: 'fch',
  DOMAIN: 'domain',
  ADDRESS_WITH_CUSTOM_DOMAIN: 'combo',
  ADDRESS_FREE: 'free_fch',
  DOMAIN_RENEWAL: 'domain_renewal',
  ADD_BUNDLES: 'add_bundles',
};

export const ANALYTICS_PAYMENT_TYPE = {
  FIO: 'fio',
  STRIPE: 'stripe',
  FREE: 'free',
};

export const ANALYTICS_LOGIN_METHOD = {
  PIN: 'pin',
  PASSWORD: 'password',
};

export const ANALYTICS_WALLET_TYPE = {
  LEDGER: 'ledger',
  EDGE: 'standard',
};

export const ANALYTICS_SEND_TYPE = {
  ADDRESS: 'fch',
  PUBLIC_KEY: 'pubadd',
};

export const ASTERISK_SIGN = '*';

// Must match ANALYTICS_FIO_NAME_TYPE for correct works of analytics
export const CART_ITEM_TYPE = {
  ADDRESS: 'fch',
  DOMAIN: 'domain',
  ADDRESS_WITH_CUSTOM_DOMAIN: 'combo',
  DOMAIN_RENEWAL: 'domain_renewal',
  ADD_BUNDLES: 'add_bundles',
};

export const DEFAULT_BUNDLE_SET_VALUE = 1;
export const DEFAULT_BUNDLE_AMOUNT = 100;

export const PARTNER_LOGO_MAX_WIDTH = 380;
export const PARTNER_LOGO_MAX_HEIGHT = 115;

export const REF_PROFILE_TYPE = {
  REF: 'REFERRER',
  AFFILIATE: 'AFFILIATE',
};

export const REF_PROFILE_TYPES_OPTIONS = [
  {
    id: REF_PROFILE_TYPE.REF,
    name: 'Referrer',
  },
  {
    id: REF_PROFILE_TYPE.AFFILIATE,
    name: 'Affiliate',
  },
];

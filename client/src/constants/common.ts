import { ROUTES } from './routes';
import { NFTTokenItemProps } from '../types';
import {
  PURCHASE_RESULTS_STATUS,
  PURCHASE_RESULTS_STATUS_LABELS,
  FREE_STATUS,
} from './purchase';
import { ORDER_USER_TYPES, ORDER_USER_TYPES_TITLE } from './order';

export const USER_STATUSES = {
  ACTIVE: 'ACTIVE',
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
  TRANSFER: 'fio_transfer',
  TRANSFER_DOMAIN: 'fio_domain_transfer',
  TRANSFER_FCH: 'fch_transfer',
  SET_VISIBILITY: 'fio_domain_status',
  PAYMENT_DETAILS: 'fio_data_new',
  SEND: 'token_send',
  REQUEST: 'fio_request_new',
  REJECT_FIO_REQUEST: 'fio_request_reject',
  CANCEL_FIO_REQUEST: 'fio_request_cancel',
  STAKE: 'token_stake',
  UNSTAKE: 'token_unstake',
  SIGN_NFT: 'fch_sign_nft',
  NFT_VALIDATE: 'nft_validate',
  ADD_TOKEN: 'fch_link_token',
  CREATE_WALLET: 'wallet_create',
  CART_EMPTIED: 'cart_emptied',
  WRAP_TOKENS: 'wrap_token',
  WRAP_DOMAIN: 'wrap_domain',
  UNWRAP_TOKENS: 'unwrap_token',
  UNWRAP_DOMAIN: 'unwrap_domain',
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
  ADD_SOCIAL_MEDIA_LINK: 'ADD_SOCIAL_MEDIA_LINK',
  DELETE_SOCIAL_MEDIA_LINK: 'DELETE_SOCIAL_MEDIA_LINK',
  EDIT_SOCIAL_MEDIA_LINK: 'EDIT_SOCIAL_MEDIA_LINK',
  REJECT_FIO_REQUEST: 'REJECT_FIO_REQUEST',
  CANCEL_FIO_REQUEST: 'CANCEL_FIO_REQUEST',
  STAKE: 'STAKE',
  UNSTAKE: 'UNSTAKE',
  REGISTER_ADDRESS_PRIVATE_DOMAIN: 'REGISTER_ADDRESS_PRIVATE_DOMAIN',
  WRAP_TOKENS: 'WRAP_TOKENS',
  WRAP_DOMAIN: 'WRAP_DOMAIN',
  UNWRAP_TOKENS: 'UNWRAP_TOKENS',
  UNWRAP_DOMAIN: 'UNWRAP_DOMAIN',
};

export const CONFIRM_LEDGER_ACTIONS = {
  CREATE_WALLET: 'CREATE_WALLET',
  VIEW_PUB_ADDRESS: 'VIEW_PUB_ADDRESS',
  DETAILED_FIO_REQUEST: 'DETAILED_FIO_REQUEST',
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
  SETUP_PIN: 'SETUP_PIN',
  ...CONFIRM_FIO_ACTIONS,
};

export const CONFIRM_METAMASK_ACTION = {
  ADD_SOCIAL_MEDIA_LINK: 'ADD_SOCIAL_MEDIA_LINK',
  DELETE_SOCIAL_MEDIA_LINK: 'DELETE_SOCIAL_MEDIA_LINK',
  EDIT_SOCIAL_MEDIA_LINK: 'EDIT_SOCIAL_MEDIA_LINK',
  CREATE_WALLET: 'CREATE_WALLET',
  DETAILED_FIO_REQUEST: 'DETAILED_FIO_REQUEST',
  UPDATE_EMAIL: 'UPDATE_EMAIL',
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
  METAMASK: 'METAMASK',
  WITHOUT_REGISTRATION: 'WITHOUT_REGISTRATION',
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

export const DOMAIN_WRAP_NETWORKS_LIST = [
  {
    name: 'Polygon',
    chain_code: 'MATIC',
  },
];

export const CHAIN_CODES = {
  FIO: 'FIO',
  BTC: 'BTC',
  ETH: 'ETH',
  SOCIALS: 'SOCIALS',
};

export const CURRENCY_CODES = {
  FIO: 'FIO',
  wFIO: 'wFIO',
  USDC: 'USDC',
  USD: 'USD',
} as const;

export const FIO_DATA_TRANSACTION_LINK = {
  [CHAIN_CODES.FIO]: process.env.REACT_APP_FIO_BLOCKS_TX_URL,
  [CHAIN_CODES.BTC]: 'https://blockchair.com/bitcoin/transaction/',
  [CHAIN_CODES.ETH]: 'https://etherscan.io/tx/',
};

export const CHAIN_CODE_LIST = [
  {
    id: CHAIN_CODES.ETH,
    name: 'Ethereum',
    tokens: [
      {
        id: 'ETH',
        name: 'Ethereum',
      },
      {
        id: 'REP',
        name: 'Augur',
      },
      {
        id: 'REPV2',
        name: 'Augur v2',
      },
      {
        id: 'HERC',
        name: 'Hercules',
      },
      {
        id: 'DAI',
        name: 'Dai Stablecoin',
      },
      {
        id: 'SAI',
        name: 'Sai Stablecoin',
      },
      {
        id: 'WINGS',
        name: 'Wings',
      },
      {
        id: 'USDT',
        name: 'Tether',
      },
      {
        id: 'IND',
        name: 'Indorse',
      },
      {
        id: 'HUR',
        name: 'Hurify',
      },
      {
        id: 'ANTV1',
        name: 'Aragon',
      },
      {
        id: 'ANT',
        name: 'Aragon',
      },
      {
        id: 'BAT',
        name: 'Basic Attention Token',
      },
      {
        id: 'BNT',
        name: 'Bancor',
      },
      {
        id: 'GNT',
        name: 'Golem (old)',
      },
      {
        id: 'KNC',
        name: 'Kyber Network',
      },
      {
        id: 'MATIC',
        name: 'Polymath Network',
      },
      {
        id: 'STORJ',
        name: 'Storj',
      },
      {
        id: 'USDC',
        name: 'USD Coin',
      },
      {
        id: 'USDS',
        name: 'StableUSD',
      },
      {
        id: 'TUSD',
        name: 'TrueUSD',
      },
      {
        id: 'ZRX',
        name: '0x',
      },
      {
        id: 'GNO',
        name: 'Gnosis',
      },
      {
        id: 'OMG',
        name: 'OmiseGO',
      },
      {
        id: 'NMR',
        name: 'Numeraire',
      },
      {
        id: 'MKR',
        name: 'Maker',
      },
      {
        id: 'GUSD',
        name: 'Gemini Dollar',
      },
      {
        id: 'PAX',
        name: 'Paxos',
      },
      {
        id: 'SALT',
        name: 'SALT',
      },
      {
        id: 'MANA',
        name: 'Decentraland',
      },
      {
        id: 'NEXO',
        name: 'Nexo',
      },
      {
        id: 'FUN',
        name: 'FunFair',
      },
      {
        id: 'KIN',
        name: 'Kin',
      },
      {
        id: 'LINK',
        name: 'Chainlink',
      },
      {
        id: 'BRZ',
        name: 'BRZ Token',
      },
      {
        id: 'CREP',
        name: 'Compound Augur',
      },
      {
        id: 'CUSDC',
        name: 'Compound USDC',
      },
      {
        id: 'CETH',
        name: 'Compound ETH',
      },
      {
        id: 'CBAT',
        name: 'Compound BAT',
      },
      {
        id: 'CZRX',
        name: 'Compound ZRX',
      },
      {
        id: 'CWBTC',
        name: 'Compound WBTC',
      },
      {
        id: 'CSAI',
        name: 'Compound SAI',
      },
      {
        id: 'CDAI',
        name: 'Compound DAI',
      },
      {
        id: 'ETHBNT',
        name: 'BNT Smart Token Relay',
      },
      {
        id: 'OXT',
        name: 'Orchid',
      },
      {
        id: 'COMP',
        name: 'Compound',
      },
      {
        id: 'MET',
        name: 'Metronome',
      },
      {
        id: 'SNX',
        name: 'Synthetix Network',
      },
      {
        id: 'SUSD',
        name: 'Synthetix USD',
      },
      {
        id: 'SBTC',
        name: 'Synthetix BTC',
      },
      {
        id: 'AAVE',
        name: 'Aave',
      },
      {
        id: 'AYFI',
        name: 'Aave Interest Bearing YFI',
      },
      {
        id: 'ALINK',
        name: 'Aave Interest Bearing LINK',
      },
      {
        id: 'ADAI',
        name: 'Aave Interest Bearing Dai',
      },
      {
        id: 'ABAT',
        name: 'Aave Interest Bearing BAT',
      },
      {
        id: 'AWETH',
        name: 'Aave Interest Bearing Wrapped ETH',
      },
      {
        id: 'AWBTC',
        name: 'Aave Interest Bearing Wrapped BTC',
      },
      {
        id: 'ASNX',
        name: 'Aave Interest Bearing SNX',
      },
      {
        id: 'AREN',
        name: 'Aave Interest Bearing REN',
      },
      {
        id: 'AUSDT',
        name: 'Aave Interest Bearing USDT',
      },
      {
        id: 'AMKR',
        name: 'Aave Interest Bearing MKR',
      },
      {
        id: 'AMANA',
        name: 'Aave Interest Bearing MANA',
      },
      {
        id: 'AZRX',
        name: 'Aave Interest Bearing ZRX',
      },
      {
        id: 'AKNC',
        name: 'Aave Interest Bearing KNC',
      },
      {
        id: 'AUSDC',
        name: 'Aave Interest Bearing USDC',
      },
      {
        id: 'ASUSD',
        name: 'Aave Interest Bearing SUSD',
      },
      {
        id: 'AUNI',
        name: 'Aave Interest Bearing UNI',
      },
      {
        id: 'WBTC',
        name: 'Wrapped Bitcoin',
      },
      {
        id: 'YFI',
        name: 'Yearn Finance',
      },
      {
        id: 'CRV',
        name: 'Curve DAO Token',
      },
      {
        id: 'BAL',
        name: 'Balancer',
      },
      {
        id: 'SUSHI',
        name: 'Sushi Token',
      },
      {
        id: 'UMA',
        name: 'UMA',
      },
      {
        id: 'BADGER',
        name: 'Badger',
      },
      {
        id: 'IDLE',
        name: 'Idle Finance',
      },
      {
        id: 'NXM',
        name: 'Nexus Mutual',
      },
      {
        id: 'CREAM',
        name: 'Cream',
      },
      {
        id: 'PICKLE',
        name: 'PickleToken',
      },
      {
        id: 'CVP',
        name: 'Concentrated Voting Power',
      },
      {
        id: 'ROOK',
        name: 'Keeper DAO',
      },
      {
        id: 'DOUGH',
        name: 'PieDAO',
      },
      {
        id: 'COMBO',
        name: 'COMBO',
      },
      {
        id: 'INDEX',
        name: 'INDEX COOP',
      },
      {
        id: 'WETH',
        name: 'Wrapped ETH',
      },
      {
        id: 'RENBTC',
        name: 'Ren BTC',
      },
      {
        id: 'RENBCH',
        name: 'Ren BCH',
      },
      {
        id: 'RENZEC',
        name: 'Ren ZEC',
      },
      {
        id: 'TBTC',
        name: 'tBTC',
      },
      {
        id: 'DPI',
        name: 'DefiPulse Index',
      },
      {
        id: 'YETI',
        name: 'Yearn Ecosystem Token Index',
      },
      {
        id: 'BAND',
        name: 'BAND',
      },
      {
        id: 'REN',
        name: 'Ren',
      },
      {
        id: 'AMPL',
        name: 'Ampleforth',
      },
      {
        id: 'OCEAN',
        name: 'OCEAN',
      },
      {
        id: 'GLM',
        name: 'Golem',
      },
      {
        id: 'UNI',
        name: 'Uniswap',
      },
    ],
  },
  { id: CHAIN_CODES.BTC, name: 'Bitcoin' },
  { id: 'ALGO', name: 'Algorand' },
  { id: 'BSC', name: 'Binance Smart Chain' },
  { id: 'ADA', name: 'Cardano' },
  { id: 'DGB', name: 'DigiByte' },
  { id: 'EOS', name: 'EOS' },
  { id: 'FLOW', name: 'Flow' },
  { id: 'MATIC', name: 'Polygon' },
  { id: 'SOL', name: 'Solana' },
  { id: 'XTZ', name: 'TEZOS' },
  { id: 'THETA', name: 'THETA' },
  { id: 'TRX', name: 'TRON' },
  { id: 'WAX', name: 'WAXP' },
];

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

export const ANALYTICS_LOGIN_METHOD = {
  PIN: 'pin',
  PASSWORD: 'password',
  EXTERNAL: 'external',
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
export const CART_ITEM_TYPES_WITH_PERIOD = [
  CART_ITEM_TYPE.DOMAIN,
  CART_ITEM_TYPE.DOMAIN_RENEWAL,
  CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN,
];

export const CART_ITEM_PERIOD_OPTIONS = [
  {
    id: '1',
    name: '1 Year',
  },
  {
    id: '2',
    name: '2 Years',
  },
  {
    id: '3',
    name: '3 Years',
  },
];

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

export const REF_PROFILE_TYPES_FILTER_OPTIONS = [
  {
    id: '',
    name: 'All',
  },
  {
    id: REF_PROFILE_TYPE.REF,
    name: 'Referrer',
  },
  {
    id: REF_PROFILE_TYPE.AFFILIATE,
    name: 'Affiliate',
  },
];

export const ORDER_AMOUNT_FILTER_OPTIONS = [
  {
    id: '',
    name: 'All',
  },
  {
    id: FREE_STATUS.IS_FREE.toString(),
    name: '0',
  },
  {
    id: FREE_STATUS.IS_PAID.toString(),
    name: '> 0',
  },
];

export const ORDER_USER_TYPE_FILTER_OPTIONS = [
  {
    id: '',
    name: 'All',
  },
  {
    id: ORDER_USER_TYPES.DASHBOARD,
    name: ORDER_USER_TYPES_TITLE.DASHBOARD,
  },
  {
    id: ORDER_USER_TYPES.NO_PROFILE_FLOW,
    name: ORDER_USER_TYPES_TITLE.NO_PROFILE_FLOW,
  },
  {
    id: ORDER_USER_TYPES.PARTNER_API_CLIENT,
    name: ORDER_USER_TYPES_TITLE.PARTNER_API_CLIENT,
  },
];

export const ORDER_STATUS_FILTER_OPTIONS = [
  {
    id: '',
    name: 'All',
  },
  {
    id: PURCHASE_RESULTS_STATUS.SUCCESS.toString(),
    name: PURCHASE_RESULTS_STATUS_LABELS[PURCHASE_RESULTS_STATUS.SUCCESS],
  },
  {
    id: PURCHASE_RESULTS_STATUS.NEW.toString(),
    name: PURCHASE_RESULTS_STATUS_LABELS[PURCHASE_RESULTS_STATUS.NEW],
  },
  {
    id: PURCHASE_RESULTS_STATUS.CANCELED.toString(),
    name: PURCHASE_RESULTS_STATUS_LABELS[PURCHASE_RESULTS_STATUS.CANCELED],
  },
  {
    id: PURCHASE_RESULTS_STATUS.FAILED.toString(),
    name: PURCHASE_RESULTS_STATUS_LABELS[PURCHASE_RESULTS_STATUS.FAILED],
  },
  {
    id: PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS.toString(),
    name:
      PURCHASE_RESULTS_STATUS_LABELS[PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS],
  },
];

export const ORDER_DATE_FILTER_OPTIONS = [
  {
    id: '',
    name: 'All',
  },
  {
    id: 'today',
    name: 'Today',
  },
  {
    id: 'yesterday',
    name: 'Yesterday',
  },
  {
    id: 'last7days',
    name: 'Last 7 days',
  },
  {
    id: 'lastMonth',
    name: 'Last 30 days',
  },
  {
    id: 'lastHalfOfYear',
    name: 'Last half year',
  },
  {
    id: 'custom',
    name: 'Custom Dates',
  },
] as const;

export const NOT_FOUND_CODE = 'NOT_FOUND';

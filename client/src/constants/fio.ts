export const ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION = 5;

export const FIO_CHAIN_CODE = 'FIO';

export const MAX_PUBLIC_ADDRESS_LENGTH = 128;

export const TOKEN_LINK_MIN_WAIT_TIME = 2000;

export const DOMAIN_EXPIRED_DAYS = 30;

export const MAX_MEMO_SIZE = 64;
export const MAX_TOKEN_LENGTH = 10;
export const MAX_CHAIN_LENGTH = 10;

export const TRANSACTION_DEFAULT_OFFSET_EXPIRATION = 2700; // 45 min

export const DEFAULT_TABLE_RAWS_LIMIT = 2000;

export const FIO_ORACLE_ACCOUNT_NAME = 'fio.oracle';

export const ACTIONS = {
  transferTokens: 'transferTokens',
  addPublicAddress: 'addPublicAddress',
  addPublicAddresses: 'addPublicAddresses',
  removeAllPublicAddresses: 'removeAllPublicAddresses',
  removePublicAddresses: 'removePublicAddresses',
  setFioDomainVisibility: 'setFioDomainVisibility',
  rejectFundsRequest: 'rejectFundsRequest',
  requestFunds: 'requestFunds',
  cancelFundsRequest: 'cancelFundsRequest',
  recordObtData: 'recordObtData',
  registerFioAddress: 'registerFioAddress',
  registerFioDomain: 'registerFioDomain',
  registerOwnerFioDomain: 'registerOwnerFioDomain',
  renewFioDomain: 'renewFioDomain',
  transferFioAddress: 'transferFioAddress',
  transferFioDomain: 'transferFioDomain',
  pushTransaction: 'pushTransaction',
  addBundledTransactions: 'addBundledTransactions',
  addNft: 'addNft',
  stakeFioTokens: 'stakeFioTokens',
  unStakeFioTokens: 'unStakeFioTokens',
  wrapFioTokens: 'wrapFioTokens',
  wrapFioDomain: 'wrapFioDomain',
};

export const TRANSACTION_ACTION_NAMES = {
  [ACTIONS.addNft]: 'addnft',
  [ACTIONS.wrapFioTokens]: 'wraptokens',
  [ACTIONS.wrapFioDomain]: 'wrapdomain',
};

export const TRANSACTION_ACCOUNT_NAMES = {
  [ACTIONS.wrapFioTokens]: FIO_ORACLE_ACCOUNT_NAME,
  [ACTIONS.wrapFioDomain]: FIO_ORACLE_ACCOUNT_NAME,
};

export const ACTIONS_TO_END_POINT_KEYS = {
  [ACTIONS.requestFunds]: 'newFundsRequest',
  [ACTIONS.cancelFundsRequest]: 'cancelFundsRequest',
  [ACTIONS.registerFioAddress]: 'registerFioAddress',
  [ACTIONS.registerFioDomain]: 'registerFioDomain',
  [ACTIONS.renewFioDomain]: 'renewFioDomain',
  [ACTIONS.addPublicAddresses]: 'addPubAddress',
  [ACTIONS.removeAllPublicAddresses]: 'removeAllPubAddresses',
  [ACTIONS.removePublicAddresses]: 'removePubAddress',
  [ACTIONS.setFioDomainVisibility]: 'setFioDomainPublic',
  [ACTIONS.rejectFundsRequest]: 'rejectFundsRequest',
  [ACTIONS.recordObtData]: 'recordObtData',
  [ACTIONS.transferTokens]: 'transferTokens',
  [ACTIONS.pushTransaction]: 'pushTransaction',
  [ACTIONS.transferFioAddress]: 'transferFioAddress',
  [ACTIONS.transferFioDomain]: 'transferFioDomain',
  [ACTIONS.stakeFioTokens]: 'pushTransaction',
  [ACTIONS.unStakeFioTokens]: 'pushTransaction',
  [ACTIONS.addBundledTransactions]: 'addBundledTransactions',
};

export const FIO_REQUEST_STATUS_TYPES: { [key: string]: string } = {
  REJECTED: 'rejected',
  PAID: 'sent_to_blockchain',
  PENDING: 'requested',
  CANCELED: 'cancelled',
};

export const FIO_REQUEST_STATUS_TYPES_TITLES: { [key: string]: string } = {
  [FIO_REQUEST_STATUS_TYPES.REJECTED]: 'REJECTED',
  [FIO_REQUEST_STATUS_TYPES.PAID]: 'PAID',
  [FIO_REQUEST_STATUS_TYPES.PENDING]: 'PENDING',
  [FIO_REQUEST_STATUS_TYPES.CANCELED]: 'CANCELED',
};

export const BUNDLES_TX_COUNT = {
  ADD_PUBLIC_ADDRESS: 1,
  REMOVE_PUBLIC_ADDRESS: 1,
  REMOVE_ALL_PUBLIC_ADDRESSES: 1,
  NEW_FIO_REQUEST: 2,
  CANCEL_FIO_REQUEST: 1,
  REJECT_FIO_REQUEST: 1,
  RECORD_OBT_DATA: 2,
  ADD_NFT: 2,
  REMOVE_NFT: 1,
  STAKE: 1,
  UNSTAKE: 1,
};

export const GET_TABLE_ROWS_URL = `${process.env.REACT_APP_FIO_BASE_URL}chain/get_table_rows`;

export const DOMAIN_TYPE = {
  CUSTOM: 'custom',
  FREE: 'free',
  PREMIUM: 'premium',
  USERS: 'users',
  PRIVATE: 'private',
} as const;

export const DOMAIN_TYPE_PARAMS: {
  [key: string]: {
    title: string;
    modalTitle: string;
    modalBodyText: string;
    isBlue?: boolean;
    isOrange?: boolean;
    isRed?: boolean;
    isRose?: boolean;
  };
} = {
  [DOMAIN_TYPE.CUSTOM]: {
    title: 'Custom',
    isRed: true,
    modalTitle: 'Custom FIO Crypto Handle',
    modalBodyText:
      'When you register a Custom FIO Crypto Handle you also get your own FIO Domain (@domain). By default this domain is private, meaning only you can create new handles on it.',
  },
  [DOMAIN_TYPE.FREE]: {
    title: 'Free',
    isRose: true,
    modalTitle: 'Free FIO Crypto Handle',
    modalBodyText:
      'Please enjoy this free FIO Crypto Handle for life. Limit: one free handle per user.',
  },
  [DOMAIN_TYPE.PREMIUM]: {
    title: 'Premium',
    isBlue: true,
    modalTitle: 'Premium FIO Crypto Handle',
    modalBodyText:
      'Premium FIO Crypto Handles are on hand-picked FIO Domains (@domain), which are reserved for users who want to stand out from the crowd.',
  },
  [DOMAIN_TYPE.USERS]: {
    title: 'My Domain',
    isOrange: true,
    modalTitle: 'My Domain',
    modalBodyText:
      'You already own the FIO Domain, now get a FIO Crypto Handle on it.',
  },
};

export const FIO_ACCOUNT_TYPES = {
  FREE: 'FREE',
  PAID: 'PAID',
  FREE_FALLBACK: 'FREE_FALLBACK',
  PAID_FALLBACK: 'PAID_FALLBACK',
  REGULAR: 'REGULAR',
} as const;

export const NOT_DELETABLE_ACCOUNTS: string[] = [
  FIO_ACCOUNT_TYPES.FREE,
  FIO_ACCOUNT_TYPES.FREE_FALLBACK,
  FIO_ACCOUNT_TYPES.PAID,
  FIO_ACCOUNT_TYPES.PAID_FALLBACK,
];

export const FIO_ACCOUNT_TYPES_OPTIONS = [
  {
    id: FIO_ACCOUNT_TYPES.FREE,
    name: FIO_ACCOUNT_TYPES.FREE,
  },
  {
    id: FIO_ACCOUNT_TYPES.PAID,
    name: FIO_ACCOUNT_TYPES.PAID,
  },
  {
    id: FIO_ACCOUNT_TYPES.FREE_FALLBACK,
    name: FIO_ACCOUNT_TYPES.FREE_FALLBACK,
  },
  {
    id: FIO_ACCOUNT_TYPES.PAID_FALLBACK,
    name: FIO_ACCOUNT_TYPES.PAID_FALLBACK,
  },
  {
    id: FIO_ACCOUNT_TYPES.REGULAR,
    name: FIO_ACCOUNT_TYPES.REGULAR,
  },
];

export const FIO_CHAIN_ID = {
  MAINNET: '21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c',
  TESTNET: 'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e',
};

export const FIO_PROXY_LIST = {
  [FIO_CHAIN_ID.MAINNET]: [
    'proxy1@binancestaking',
    'proxy@greymass',
    'finance@edge',
    'blue@proxy',
    'reaper@guarda',
    'proxy@blockpane',
    'vote@blockpane',
    'proxy@moonstake',
    'proxy@genereos',
    'proxy@everstake',
    'crypto@tribe',
    'proxy@wallet',
    'anyo@fiosweden',
    'imdsc@edge',
    'main@mycointainer',
    'proxy@secux',
    'lethanhmy@cm',
    'proxy@zenblocks',
    'andy@secux',
  ],
  [FIO_CHAIN_ID.TESTNET]: [
    'congle@fiotestnet',
    'ms2tpid@fiotestnet',
    'autoproxy@fiotestnet',
    'dashboard@fiotestnet',
    'ngocdam5@fiotestnet',
    'proxy@fiotestnet',
    'ericstake@fiotestnet',
    'tpid@uniqueone',
    'smoketestproxy1@fiotestnet',
    'anyo@fiosweden',
    'proxy2@alohatest',
    'proxy1@alohatest',
    'currencyhub@fiotestnet',
    'ericanchor@fiotestnet',
  ],
};

export const DEFAULT_EDGE_WALLET_NAME = 'io.fioprotocol.app';

export const LOW_BUNDLES_THRESHOLD = 25;

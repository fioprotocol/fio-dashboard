export const ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION = 5;

export const FIO_CHAIN_CODE = 'FIO';

export const METAMASK_DOMAIN_NAME = 'metamask';

export const MAX_PUBLIC_ADDRESS_LENGTH = 128;

export const TOKEN_LINK_MIN_WAIT_TIME = 2000;

export const DOMAIN_EXPIRED_DAYS = 30;

export const MAX_MEMO_SIZE = 64;
export const MAX_TOKEN_LENGTH = 10;
export const MAX_CHAIN_LENGTH = 10;

export const TRANSACTION_DEFAULT_OFFSET_EXPIRATION = 2700; // 45 min in seconds
export const TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS =
  TRANSACTION_DEFAULT_OFFSET_EXPIRATION * 1000; // 45 min in miliseconds

export const DEFAULT_TABLE_RAWS_LIMIT = 2000;

export const FIO_ORACLE_ACCOUNT_NAME = 'fio.oracle';

export const FIO_DEFAULT_ACCOUNT = 'fio.address';

export const FIO_CONTRACT_ACCOUNT_NAMES = {
  fioAddress: 'fio.address',
  fioToken: 'fio.token',
  fioRecordObt: 'fio.reqobt',
  fioStaking: 'fio.staking',
  fioOracle: 'fio.oracle',
};

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
  registerFioDomainAddress: 'registerFioDomainAddress',
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
  [ACTIONS.addBundledTransactions]: 'addbundles',
  [ACTIONS.addPublicAddress]: 'addaddress',
  [ACTIONS.addPublicAddresses]: 'addaddress',
  [ACTIONS.addNft]: 'addnft',
  [ACTIONS.cancelFundsRequest]: 'cancelfndreq',
  [ACTIONS.requestFunds]: 'newfundsreq',
  [ACTIONS.registerFioAddress]: 'regaddress',
  [ACTIONS.registerFioDomain]: 'regdomain',
  [ACTIONS.registerFioDomainAddress]: 'regdomadd',
  [ACTIONS.setFioDomainVisibility]: 'setdomainpub',
  [ACTIONS.recordObtData]: 'recordobt',
  [ACTIONS.rejectFundsRequest]: 'rejectfndreq',
  [ACTIONS.removeAllPublicAddresses]: 'remalladdr',
  [ACTIONS.removePublicAddresses]: 'remaddress',
  [ACTIONS.renewFioDomain]: 'renewdomain',
  [ACTIONS.stakeFioTokens]: 'stakefio',
  [ACTIONS.transferFioAddress]: 'xferaddress',
  [ACTIONS.transferFioDomain]: 'xferdomain',
  [ACTIONS.transferTokens]: 'trnsfiopubky',
  [ACTIONS.unStakeFioTokens]: 'unstakefio',
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

export const FIO_ACCOUNT_NAMES = {
  [ACTIONS.transferTokens]: 'fio.token',
  [ACTIONS.recordObtData]: 'fio.reqobt',
  [ACTIONS.stakeFioTokens]: 'fio.staking',
  [ACTIONS.unStakeFioTokens]: 'fio.staking',
  [ACTIONS.transferFioDomain]: 'fio.address',
  [ACTIONS.transferFioAddress]: 'fio.address',
  [ACTIONS.setFioDomainVisibility]: 'fio.address',
  [ACTIONS.renewFioDomain]: 'fio.address',
  [ACTIONS.addBundledTransactions]: 'fio.address',
  [ACTIONS.requestFunds]: 'fio.reqobt',
  [ACTIONS.rejectFundsRequest]: 'fio.reqobt',
  [ACTIONS.cancelFundsRequest]: 'fio.reqobt',
  [ACTIONS.addNft]: 'fio.address',
  [ACTIONS.registerFioAddress]: 'fio.address',
  [ACTIONS.registerFioDomain]: 'fio.address',
  [ACTIONS.registerFioDomainAddress]: 'fio.address',
  [ACTIONS.addPublicAddresses]: 'fio.address',
  [ACTIONS.removeAllPublicAddresses]: 'fio.address',
  [ACTIONS.removePublicAddresses]: 'fio.address',
  [ACTIONS.wrapFioTokens]: 'fio.oracle',
  [ACTIONS.wrapFioDomain]: 'fio.oracle',
};

export const FIO_ACTION_NAMES = {
  [ACTIONS.transferTokens]: 'trnsfiopubky',
  [ACTIONS.recordObtData]: 'recordobt',
  [ACTIONS.stakeFioTokens]: 'stakefio',
  [ACTIONS.unStakeFioTokens]: 'unstakefio',
  [ACTIONS.transferFioDomain]: 'xferdomain',
  [ACTIONS.transferFioAddress]: 'xferaddress',
  [ACTIONS.setFioDomainVisibility]: 'setdomainpub',
  [ACTIONS.renewFioDomain]: 'renewdomain',
  [ACTIONS.addBundledTransactions]: 'addbundles',
  [ACTIONS.requestFunds]: 'newfundsreq',
  [ACTIONS.rejectFundsRequest]: 'rejectfndreq',
  [ACTIONS.cancelFundsRequest]: 'cancelfndreq',
  [ACTIONS.addNft]: 'addnft',
  [ACTIONS.registerFioAddress]: 'regaddress',
  [ACTIONS.registerFioDomain]: 'regdomain',
  [ACTIONS.registerFioDomainAddress]: 'regdomadd',
  [ACTIONS.addPublicAddresses]: 'addaddress',
  [ACTIONS.removeAllPublicAddresses]: 'remalladdr',
  [ACTIONS.removePublicAddresses]: 'remaddress',
  [ACTIONS.wrapFioTokens]: 'wraptokens',
  [ACTIONS.wrapFioDomain]: 'wrapdomain',
};

export const DOMAIN_TYPE = {
  CUSTOM: 'custom',
  ALLOW_FREE: 'allow-free',
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
    modalTitle: 'Custom FIO Handle',
    modalBodyText:
      'When you register a Custom FIO Handle you also get your own FIO Domain (@domain). By default this domain is private, meaning only you can create new handles on it.',
  },
  [DOMAIN_TYPE.ALLOW_FREE]: {
    title: 'Free',
    isRose: true,
    modalTitle: 'Free FIO Handle',
    modalBodyText:
      'Please enjoy this free FIO Handle for life. Limit: one free handle per user.',
  },
  [DOMAIN_TYPE.PREMIUM]: {
    title: 'Premium',
    isBlue: true,
    modalTitle: 'Premium FIO Handle',
    modalBodyText:
      'Premium FIO Handles are on hand-picked FIO Domains (@domain), which are reserved for users who want to stand out from the crowd.',
  },
  [DOMAIN_TYPE.USERS]: {
    title: 'My Domain',
    isOrange: true,
    modalTitle: 'My Domain',
    modalBodyText:
      'You already own the FIO Domain, now get a FIO Handle on it.',
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
    'stake@bpkiwi',
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

export const DEFAULT_FIO_RECORDS_LIMIT = 100;

export const DEFAULT_MAX_FEE_MULTIPLE_AMOUNT = 1.25;

export const FIO_CONTENT_TYPES = {
  RECORD_OBT_DATA: 'record_obt_data_content',
  NEW_FUNDS: 'new_funds_content',
};

export const FIO_API_URLS_TYPES = {
  DASHBOARD_API: 'DASHBOARD_API',
  DASHBOARD_HISTORY_URL: 'DASHBOARD_HISTORY_URL',
  WRAP_STATUS_PAGE_API: 'WRAP_STATUS_PAGE_API',
  WRAP_STATUS_PAGE_HISTORY_URL: 'WRAP_STATUS_PAGE_HISTORY_URL',
};

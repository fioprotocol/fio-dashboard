import {
  Account,
  Action,
  EndPoint,
  GenericAction,
  RequestStatus,
} from '@fioprotocol/fiosdk';

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

export enum AdditionalAction {
  addNft = 'addNft',
  voteProducer = 'voteproducer',
  voteProxy = 'voteproxy',
  wrapFioTokens = 'wrapFioTokens',
  wrapFioDomain = 'wrapFioDomain',
}

export type DashboardAction = AdditionalAction | GenericAction;

export const FIO_REQUEST_STATUS_TYPES_TITLES: { [key: string]: string } = {
  [RequestStatus.rejected]: 'REJECTED',
  [RequestStatus.sentToBlockchain]: 'PAID',
  [RequestStatus.requested]: 'PENDING',
  [RequestStatus.canceled]: 'CANCELED',
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
  VOTE_BLOCK_PRODUCER: 1,
  VOTE_PROXY: 1,
};

const GENERIC_ACTIONS_ENDPOINTS = {
  [GenericAction.pushTransaction]: EndPoint.pushTransaction,
  [GenericAction.burnFioAddress]: EndPoint.burnFioAddress,
  [GenericAction.cancelFundsRequest]: EndPoint.cancelFundsRequest,
  [GenericAction.setFioDomainVisibility]: EndPoint.setFioDomainPublic,
  [GenericAction.rejectFundsRequest]: EndPoint.rejectFundsRequest,
  [GenericAction.requestFunds]: EndPoint.newFundsRequest,
  [GenericAction.isAvailable]: EndPoint.availCheck,
  [GenericAction.stakeFioTokens]: EndPoint.pushTransaction,
  [GenericAction.unStakeFioTokens]: EndPoint.pushTransaction,
  [GenericAction.recordObtData]: EndPoint.recordObtData,
  [GenericAction.registerFioDomainAddress]: EndPoint.registerFioDomainAddress,
  [GenericAction.registerFioAddress]: EndPoint.registerFioAddress,
  [GenericAction.registerOwnerFioAddress]: EndPoint.registerFioAddress,
  [GenericAction.registerFioDomain]: EndPoint.registerFioDomain,
  [GenericAction.registerOwnerFioDomain]: EndPoint.registerFioDomain,
  [GenericAction.renewFioDomain]: EndPoint.renewFioDomain,
  [GenericAction.renewFioAddress]: EndPoint.renewFioAddress,
  [GenericAction.transferFioAddress]: EndPoint.transferFioAddress,
  [GenericAction.transferFioDomain]: EndPoint.transferFioDomain,
  [GenericAction.transferTokens]: EndPoint.transferTokensPublicKey,
  [GenericAction.transferLockedTokens]: EndPoint.transferLockedTokens,
  [GenericAction.addBundledTransactions]: EndPoint.addBundledTransactions,
  [GenericAction.addPublicAddress]: EndPoint.addPublicAddress,
  [GenericAction.addPublicAddresses]: EndPoint.addPublicAddress,
  [GenericAction.removePublicAddresses]: EndPoint.removePublicAddress,
  [GenericAction.removeAllPublicAddresses]: EndPoint.removeAllPublicAddresses,
  [GenericAction.getObtData]: EndPoint.getObtData,
  [GenericAction.getGranteePermissions]: EndPoint.getGranteePermissions,
  [GenericAction.getGrantorPermissions]: EndPoint.getGrantorPermissions,
  [GenericAction.getObjectPermissions]: EndPoint.getObjectPermissions,
  [GenericAction.getFioBalance]: EndPoint.getFioBalance,
  [GenericAction.getFioNames]: EndPoint.getFioNames,
  [GenericAction.getFioDomains]: EndPoint.getFioDomains,
  [GenericAction.getFioAddresses]: EndPoint.getFioAddresses,
  [GenericAction.getPendingFioRequests]: EndPoint.getPendingFioRequests,
  [GenericAction.getReceivedFioRequests]: EndPoint.getReceivedFioRequests,
  [GenericAction.getCancelledFioRequests]: EndPoint.getCancelledFioRequests,
  [GenericAction.getSentFioRequests]: EndPoint.getSentFioRequests,
  [GenericAction.getPublicAddress]: EndPoint.getPublicAddress,
  [GenericAction.getFioPublicAddress]: EndPoint.getPublicAddress,
  [GenericAction.getPublicAddresses]: EndPoint.getPublicAddresses,
  [GenericAction.getAccount]: EndPoint.getAccount,
  [GenericAction.getLocks]: EndPoint.getLocks,
  [GenericAction.getNfts]: EndPoint.getNftsFioAddress,
  [GenericAction.getAbi]: EndPoint.getRawAbi,
  [GenericAction.getOracleFees]: EndPoint.getOracleFees,
  [GenericAction.getFee]: EndPoint.getFee,
  [GenericAction.getFeeForRecordObtData]: EndPoint.getFee,
  [GenericAction.getFeeForNewFundsRequest]: EndPoint.getFee,
  [GenericAction.getFeeForRejectFundsRequest]: EndPoint.getFee,
  [GenericAction.getFeeForBurnFioAddress]: EndPoint.getFee,
  [GenericAction.getFeeForTransferFioAddress]: EndPoint.getFee,
  [GenericAction.getFeeForTransferFioDomain]: EndPoint.getFee,
  [GenericAction.getFeeForAddBundledTransactions]: EndPoint.getFee,
  [GenericAction.getFeeForAddPublicAddress]: EndPoint.getFee,
  [GenericAction.getFeeForCancelFundsRequest]: EndPoint.getFee,
  [GenericAction.getFeeForRemovePublicAddresses]: EndPoint.getFee,
  [GenericAction.getFeeForRemoveAllPublicAddresses]: EndPoint.getFee,
  [GenericAction.getFeeForTransferLockedTokens]: EndPoint.getFee,
  [GenericAction.getEncryptKey]: EndPoint.getEncryptKey,
  [GenericAction.getAccountPubKey]: EndPoint.getAccountFioPublicKey,
};

export const getEndPointByGenericAction = (genericAction: GenericAction) => {
  const endpoint =
    GENERIC_ACTIONS_ENDPOINTS[
      genericAction as keyof typeof GENERIC_ACTIONS_ENDPOINTS
    ];

  if (!endpoint) {
    throw new Error(`EndPoint for ${genericAction} not exist`);
  }

  return endpoint;
};

export const FIO_ENDPOINT_TAG_NAME = {
  voteProducer: 'voteproducer',
  voteProxy: 'voteproxy',
} as const;

export const FIO_ENDPOINT_NAME = {
  [FIO_ENDPOINT_TAG_NAME.voteProducer]: 'vote_producer',
  [FIO_ENDPOINT_TAG_NAME.voteProxy]: 'proxy_vote',
} as const;

export type FullEndPoint =
  | EndPoint
  | typeof FIO_ENDPOINT_NAME[keyof typeof FIO_ENDPOINT_NAME];

const FIO_ACCOUNT_NAMES = {
  [GenericAction.transferTokens]: Account.token,
  [GenericAction.recordObtData]: Account.reqObt,
  [GenericAction.stakeFioTokens]: Account.staking,
  [GenericAction.unStakeFioTokens]: Account.staking,
  [GenericAction.transferFioDomain]: Account.address,
  [GenericAction.transferFioAddress]: Account.address,
  [GenericAction.setFioDomainVisibility]: Account.address,
  [GenericAction.renewFioDomain]: Account.address,
  [GenericAction.addBundledTransactions]: Account.address,
  [GenericAction.requestFunds]: Account.reqObt,
  [GenericAction.rejectFundsRequest]: Account.reqObt,
  [GenericAction.cancelFundsRequest]: Account.reqObt,
  [AdditionalAction.addNft]: Account.address,
  [GenericAction.registerFioAddress]: Account.address,
  [GenericAction.registerFioDomain]: Account.address,
  [GenericAction.registerFioDomainAddress]: Account.address,
  [GenericAction.addPublicAddresses]: Account.address,
  [GenericAction.removeAllPublicAddresses]: Account.address,
  [GenericAction.removePublicAddresses]: Account.address,
  [AdditionalAction.wrapFioTokens]: Account.oracle,
  [AdditionalAction.wrapFioDomain]: Account.oracle,
  [AdditionalAction.voteProducer]: Account.eosio,
  [AdditionalAction.voteProxy]: Account.eosio,
};

export const getAccountByDashboardAction = (
  dashboardAction: DashboardAction,
) => {
  const account =
    FIO_ACCOUNT_NAMES[dashboardAction as keyof typeof FIO_ACCOUNT_NAMES];

  if (!account) {
    throw new Error(`Account for ${dashboardAction} not exist`);
  }

  return account;
};

const FIO_ACTION_NAMES = {
  [GenericAction.transferTokens]: Action.transferTokensKey,
  [GenericAction.recordObtData]: Action.recordObt,
  [GenericAction.stakeFioTokens]: Action.stake,
  [GenericAction.unStakeFioTokens]: Action.unstake,
  [GenericAction.transferFioDomain]: Action.transferDomain,
  [GenericAction.transferFioAddress]: Action.transferAddress,
  [GenericAction.setFioDomainVisibility]: Action.setDomainPublic,
  [GenericAction.renewFioDomain]: Action.renewDomain,
  [GenericAction.addBundledTransactions]: Action.addBundledTransactions,
  [GenericAction.requestFunds]: Action.newFundsRequest,
  [GenericAction.rejectFundsRequest]: Action.rejectFundsRequest,
  [GenericAction.cancelFundsRequest]: Action.cancelFundsRequest,
  [AdditionalAction.addNft]: Action.addNft,
  [GenericAction.registerFioAddress]: Action.regAddress,
  [GenericAction.registerFioDomain]: Action.regDomain,
  [GenericAction.registerFioDomainAddress]: Action.regDomainAddress,
  [GenericAction.addPublicAddresses]: Action.addPublicAddresses,
  [GenericAction.removeAllPublicAddresses]: Action.removeAllAddresses,
  [GenericAction.removePublicAddresses]: Action.removeAddress,
  [AdditionalAction.voteProducer]: Action.voteProducer,
  [AdditionalAction.voteProxy]: FIO_ENDPOINT_TAG_NAME.voteProxy,
  [AdditionalAction.wrapFioTokens]: Action.wrapTokens,
  [AdditionalAction.wrapFioDomain]: Action.wrapDomain,
};

export const getActionByDashboardAction = (
  dashboardAction: DashboardAction,
) => {
  const action =
    FIO_ACTION_NAMES[dashboardAction as keyof typeof FIO_ACTION_NAMES];

  if (!action) {
    throw new Error(`Action for ${dashboardAction} not exist`);
  }

  return action;
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

export const FIO_API_URLS_TYPES = {
  DASHBOARD_API: 'DASHBOARD_API',
  DASHBOARD_HISTORY_URL: 'DASHBOARD_HISTORY_URL',
  WRAP_STATUS_PAGE_API: 'WRAP_STATUS_PAGE_API',
  WRAP_STATUS_PAGE_HISTORY_URL: 'WRAP_STATUS_PAGE_HISTORY_URL',
  WRAP_STATUS_PAGE_HISTORY_V2_URL: 'WRAP_STATUS_PAGE_HISTORY_V2_URL',
};

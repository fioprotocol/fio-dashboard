const WALLET_CREATED_FROM = {
  EDGE: 'EDGE',
  LEDGER: 'LEDGER',
  METAMASK: 'METAMASK',
};

const DOMAIN_EXP_PERIOD = {
  ABOUT_TO_EXPIRE: 'ABOUT_TO_EXPIRE',
  EXPIRED_30: 'EXPIRED_30',
  EXPIRED_90: 'EXPIRED_90',
  EXPIRED: 'EXPIRED',
};

const EXPIRING_DOMAINS_EMAIL_SUBJECTS = {
  [DOMAIN_EXP_PERIOD.ABOUT_TO_EXPIRE]: 'Your FIO domain(s) are about to expire',
  [DOMAIN_EXP_PERIOD.EXPIRED_30]: 'Your FIO domain(s) have expired',
  [DOMAIN_EXP_PERIOD.EXPIRED_90]: 'Your FIO domain(s) have expired and will be burned',
  [DOMAIN_EXP_PERIOD.EXPIRED]:
    'Your FIO domain(s) and associated addresses are scheduled to be burned',
};

const EXPIRING_DOMAINS_EMAIL_TITLE = {
  [DOMAIN_EXP_PERIOD.ABOUT_TO_EXPIRE]: 'FIO Domain(s) Expiring',
  [DOMAIN_EXP_PERIOD.EXPIRED_30]: 'FIO Domain(s) have Expired',
  [DOMAIN_EXP_PERIOD.EXPIRED_90]: 'FIO Domain(s) will be burned',
  [DOMAIN_EXP_PERIOD.EXPIRED]: 'FIO Domain(s) have been burned',
};

const USER_HAS_FREE_ADDRESS_MESSAGE = 'You have already registered a free FIO Handle';

const FIO_ACTIONS = {
  transferTokens: 'transferTokens',
  addPublicAddress: 'addPublicAddress',
  addPublicAddresses: 'addPublicAddresses',
  removeAllPublicAddresses: 'removeAllPublicAddresses',
  removePublicAddresses: 'removePublicAddresses',
  setFioDomainVisibility: 'setFioDomainVisibility',
  rejectFundsRequest: 'rejectFundsRequest',
  requestFunds: 'requestFunds',
  recordObtData: 'recordObtData',
  registerFioAddress: 'registerFioAddress',
  registerFioDomain: 'registerFioDomain',
  renewFioDomain: 'renewFioDomain',
  transferFioAddress: 'transferFioAddress',
  transferFioDomain: 'transferFioDomain',
  pushTransaction: 'pushTransaction',
  addBundledTransactions: 'addBundledTransactions',
  addNft: 'addNft',
  stakeFioTokens: 'stakeFioTokens',
  unStakeFioTokens: 'unStakeFioTokens',
};

const FIO_ACTIONS_TO_END_POINT_KEYS = {
  [FIO_ACTIONS.requestFunds]: 'newFundsRequest',
  [FIO_ACTIONS.registerFioAddress]: 'registerFioAddress',
  [FIO_ACTIONS.registerFioDomain]: 'registerFioDomain',
  [FIO_ACTIONS.renewFioDomain]: 'renewFioDomain',
  [FIO_ACTIONS.addPublicAddresses]: 'addPubAddress',
  [FIO_ACTIONS.removeAllPublicAddresses]: 'removeAllPubAddresses',
  [FIO_ACTIONS.removePublicAddresses]: 'removePubAddress',
  [FIO_ACTIONS.setFioDomainVisibility]: 'setFioDomainPublic',
  [FIO_ACTIONS.rejectFundsRequest]: 'rejectFundsRequest',
  [FIO_ACTIONS.recordObtData]: 'recordObtData',
  [FIO_ACTIONS.transferTokens]: 'transferTokens',
  [FIO_ACTIONS.pushTransaction]: 'pushTransaction',
  [FIO_ACTIONS.transferFioAddress]: 'transferFioAddress',
  [FIO_ACTIONS.transferFioDomain]: 'transferFioDomain',
  [FIO_ACTIONS.stakeFioTokens]: 'pushTransaction',
  [FIO_ACTIONS.unStakeFioTokens]: 'pushTransaction',
  [FIO_ACTIONS.addBundledTransactions]: 'addBundledTransactions',
};

const FIO_ACTIONS_LABEL = {
  [FIO_ACTIONS.registerFioAddress]: 'FIO Handle Registration',
  [FIO_ACTIONS.registerFioDomain]: 'FIO Domain Registration',
  [`${FIO_ACTIONS.registerFioAddress}_${FIO_ACTIONS.registerFioDomain}`]: 'FIO Handle and Domain Registration',
  [FIO_ACTIONS.renewFioDomain]: 'FIO Domain Renewal',
  [FIO_ACTIONS.addBundledTransactions]: 'Add Bundled Transactions',
};

const FIO_ACTIONS_WITH_PERIOD = [
  FIO_ACTIONS.renewFioDomain,
  FIO_ACTIONS.registerFioDomain,
];

const FIO_ACTIONS_COMBO = [FIO_ACTIONS.registerFioAddress, FIO_ACTIONS.registerFioDomain];

const ERROR_CODES = {
  SINGED_TX_XTOKENS_REFUND_SKIP: 'SINGED_TX_XTOKENS_REFUND_SKIP',
  NOT_FOUND: 404,
  RANGE_NOT_SATISFIABLE: 416,
};

const FIO_ADDRESS_DELIMITER = '@';

const PAYMENTS_STATUSES = {
  NEW: 1,
  PENDING: 2,
  COMPLETED: 3,
  EXPIRED: 4,
  CANCELLED: 5,
  FAILED: 6,
  PENDING_PAID: 7,
  PENDING_CONFIRMED: 8,
  USER_ACTION_PENDING: 9,
  INSUFFICIENT_FUNDS: 10,
  CHARGE_FAILED: 11,
  BLOCKED: 12,
};

const PAYMENT_EVENT_STATUSES = {
  PENDING: 2,
  SUCCESS: 3,
  EXPIRED: 4,
  CANCEL: 5,
  FAILED: 6,
  PENDING_PAID: 7,
  PENDING_CONFIRMED: 8,
  USER_ACTION_PENDING: 9,
  INSUFFICIENT_FUNDS: 10,
  CHARGE_FAILED: 11,
  BLOCKED: 12,
};

const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

const ADMIN_ROLES_IDS = {
  [USER_ROLES.ADMIN]: 1,
  [USER_ROLES.SUPER_ADMIN]: 2,
};

const USER_STATUS = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
};

const USER_PROFILE_TYPE = {
  PRIMARY: 'PRIMARY',
  ALTERNATIVE: 'ALTERNATIVE',
};

const ADMIN_STATUS_IDS = {
  [USER_STATUS.NEW]: 1,
  [USER_STATUS.ACTIVE]: 2,
  [USER_STATUS.BLOCKED]: 3,
  NEW_EMAIL_NOT_VERIFIED: 4,
};

const HOUR_MS = 1000 * 60 * 60; // 1 hour
const DAY_MS = HOUR_MS * 24; // 1 day

const PRINT_SCREEN_PARAMS = {
  default: {
    width: '1275px',
    height: '1803px',
  },
};

const CART_ITEM_TYPE = {
  ADDRESS: 'fch',
  DOMAIN: 'domain',
  ADDRESS_WITH_CUSTOM_DOMAIN: 'combo',
  DOMAIN_RENEWAL: 'domain_renewal',
  ADD_BUNDLES: 'add_bundles',
};

const CART_ITEM_TYPES_WITH_PERIOD = [
  CART_ITEM_TYPE.DOMAIN,
  CART_ITEM_TYPE.DOMAIN_RENEWAL,
  CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN,
];

const CART_ITEM_TYPES_COMBO = [CART_ITEM_TYPE.ADDRESS, CART_ITEM_TYPE.DOMAIN];

const DEFAULT_BUNDLE_SET_VALUE = 1;

const QUERY_PARAMS_NAMES = {
  EMAIL: 'email',
  FIO_REQUEST_ID: 'fioRequestId',
  HASH: 'hash',
  NAME: 'name',
  ORDER_NUMBER: 'orderNumber',
  PUBLIC_KEY: 'publicKey',
  REF_CODE: 'refCode',
  TOKEN: 'token',
  USERNAME: 'username',
};

const WRAP_STATUS_NETWORKS = {
  ETH: 'ETH',
  POLYGON: 'POLYGON',
  FIO: 'FIO',
  MATIC: 'MATIC',
};

const WRAP_STATUS_NETWORKS_IDS = {
  [WRAP_STATUS_NETWORKS.ETH]: 1,
  [WRAP_STATUS_NETWORKS.POLYGON]: 2,
  [WRAP_STATUS_NETWORKS.FIO]: 3,
};

const FIO_ACCOUNT_TYPES = {
  FREE: 'FREE',
  PAID: 'PAID',
  FREE_FALLBACK: 'FREE_FALLBACK',
  PAID_FALLBACK: 'PAID_FALLBACK',
};

const ORDER_ERROR_TYPES = {
  default: 'default',
  freeAddressError: 'freeAddressError',
  userHasFreeAddress: 'userHasFreeAddress',
};

const VARS_KEYS = {
  IS_MAINTENANCE: 'IS_MAINTENANCE',
  IS_OUTBOUND_EMAIL_STOP: 'IS_OUTBOUND_EMAIL_STOP',
};

const PASSWORDS = {
  IS_OUTBOUND_EMAIL_STOP: process.env.OUTBOUND_EMAIL_STOP_PASSWORD,
};

const FIO_CHAIN_ID = {
  MAINNET: '21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c',
  TESTNET: 'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e',
};

const EXPIRED_LOCKED_PERIOD = parseInt(process.env.EXPIRED_FCH_LOCKED_PERIOD) || 1800000;

const ANALYTICS_EVENT_ACTIONS = {
  PURCHASE_FINISHED: 'purchase',
  PURCHASE_FINISHED_PARTIAL: 'purchase_partial',
  PURCHASE_FINISHED_FAILED: 'purchase_error',
};

const ABSTRACT_EMAIL_VERIFICATION_RESULTS_STATUS = {
  DELIVERABLE: 'DELIVERABLE',
  UNKNOWN: 'UNKNOWN',
};

module.exports = {
  ANALYTICS_EVENT_ACTIONS,
  WALLET_CREATED_FROM,
  DOMAIN_EXP_PERIOD,
  ERROR_CODES,
  EXPIRING_DOMAINS_EMAIL_SUBJECTS,
  EXPIRING_DOMAINS_EMAIL_TITLE,
  FIO_ACTIONS,
  FIO_ACTIONS_TO_END_POINT_KEYS,
  FIO_ACTIONS_LABEL,
  FIO_ADDRESS_DELIMITER,
  FIO_ACTIONS_WITH_PERIOD,
  FIO_ACTIONS_COMBO,
  FIO_ACCOUNT_TYPES,
  PAYMENTS_STATUSES,
  PAYMENT_EVENT_STATUSES,
  PRINT_SCREEN_PARAMS,
  USER_ROLES,
  USER_STATUS,
  ADMIN_ROLES_IDS,
  ADMIN_STATUS_IDS,
  HOUR_MS,
  DAY_MS,
  WRAP_STATUS_NETWORKS,
  WRAP_STATUS_NETWORKS_IDS,
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
  CART_ITEM_TYPES_COMBO,
  DEFAULT_BUNDLE_SET_VALUE,
  QUERY_PARAMS_NAMES,
  USER_HAS_FREE_ADDRESS_MESSAGE,
  ORDER_ERROR_TYPES,
  VARS_KEYS,
  PASSWORDS,
  FIO_CHAIN_ID,
  EXPIRED_LOCKED_PERIOD,
  ABSTRACT_EMAIL_VERIFICATION_RESULTS_STATUS,
  USER_PROFILE_TYPE,
};

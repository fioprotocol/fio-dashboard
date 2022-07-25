const WALLET_CREATED_FROM = {
  EDGE: 'EDGE',
  LEDGER: 'LEDGER',
};

const DOMAIN_EXP_PERIOD = {
  ABOUT_TO_EXPIRE: 'ABOUT_TO_EXPIRE',
  EXPIRED_30: 'EXPIRED_30',
  EXPIRED_90: 'EXPIRED_90',
  EXPIRED: 'EXPIRED',
};

const EXPIRING_DOMAINS_EMAIL_SUBJECTS = {
  [DOMAIN_EXP_PERIOD.ABOUT_TO_EXPIRE]: 'Your FIO domain(s) is about to expire',
  [DOMAIN_EXP_PERIOD.EXPIRED_30]: 'Your FIO domain(s) has expired',
  [DOMAIN_EXP_PERIOD.EXPIRED_90]: 'Your FIO domain(s) has expired and will be burned',
  [DOMAIN_EXP_PERIOD.EXPIRED]:
    'Your FIO domain(s) and associated addresses have been burned',
};

const EXPIRING_DOMAINS_EMAIL_TITLE = {
  [DOMAIN_EXP_PERIOD.ABOUT_TO_EXPIRE]: 'FIO Domain(s) Expiring',
  [DOMAIN_EXP_PERIOD.EXPIRED_30]: 'FIO Domain(s) has Expired',
  [DOMAIN_EXP_PERIOD.EXPIRED_90]: 'FIO Domain(s) will be burned',
  [DOMAIN_EXP_PERIOD.EXPIRED]: 'FIO Domain(s) has been burned',
};

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

const FIO_ADDRESS_DELIMITER = '@';

const PAYMENTS_STATUSES = {
  NEW: 1,
  PENDING: 2,
  COMPLETED: 3,
  EXPIRED: 4,
  CANCELLED: 5,
};

const PAYMENT_EVENT_STATUSES = {
  PENDING: 2,
  SUCCESS: 3,
  REVIEW: 4,
  CANCEL: 5,
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
  NEW_EMAIL_NOT_VERIFIED: 'NEW_EMAIL_NOT_VERIFIED',
};

const ADMIN_STATUS_IDS = {
  [USER_STATUS.NEW]: 1,
  [USER_STATUS.ACTIVE]: 2,
  [USER_STATUS.BLOCKED]: 3,
  [USER_STATUS.NEW_EMAIL_NOT_VERIFIED]: 4,
};

const DAY_MS = 1000 * 60 * 60 * 24; // 1 day

module.exports = {
  WALLET_CREATED_FROM,
  DOMAIN_EXP_PERIOD,
  EXPIRING_DOMAINS_EMAIL_SUBJECTS,
  EXPIRING_DOMAINS_EMAIL_TITLE,
  FIO_ACTIONS,
  FIO_ACTIONS_TO_END_POINT_KEYS,
  FIO_ADDRESS_DELIMITER,
  PAYMENTS_STATUSES,
  PAYMENT_EVENT_STATUSES,
  USER_ROLES,
  USER_STATUS,
  ADMIN_ROLES_IDS,
  ADMIN_STATUS_IDS,
  DAY_MS,
};

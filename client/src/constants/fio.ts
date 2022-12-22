export const ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION = 5;

export const FIO_CHAIN_CODE = 'FIO';

export const MAX_PUBLIC_ADDRESS_LENGTH = 128;

export const TOKEN_LINK_MIN_WAIT_TIME = 2000;

export const MAX_MEMO_SIZE = 64;
export const MAX_TOKEN_LENGTH = 10;
export const MAX_CHAIN_LENGTH = 10;

export const TRANSACTION_DEFAULT_OFFSET_EXPIRATION = 2700; // 45 min

export const ACTIONS = {
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
  wrapFioTokens: 'wrapFioTokens',
  wrapFioDomain: 'wrapFioDomain',
};

export const TRANSACTION_ACTION_NAMES = {
  [ACTIONS.addNft]: 'addnft',
  [ACTIONS.wrapFioTokens]: 'wraptokens',
  [ACTIONS.wrapFioDomain]: 'wrapdomain',
};

export const TRANSACTION_ACCOUNT_NAMES = {
  [ACTIONS.wrapFioTokens]: 'fio.oracle',
  [ACTIONS.wrapFioDomain]: 'fio.oracle',
};

export const ACTIONS_TO_END_POINT_KEYS = {
  [ACTIONS.requestFunds]: 'newFundsRequest',
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
};

export const FIO_REQUEST_STATUS_TYPES_TITLES: { [key: string]: string } = {
  [FIO_REQUEST_STATUS_TYPES.REJECTED]: 'REJECTED',
  [FIO_REQUEST_STATUS_TYPES.PAID]: 'PAID',
  [FIO_REQUEST_STATUS_TYPES.PENDING]: 'PENDING',
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
  [ACTIONS.addNft]: 'fio.address',
  [ACTIONS.registerFioAddress]: 'fio.address',
  [ACTIONS.registerFioDomain]: 'fio.address',
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
  [ACTIONS.addNft]: 'addnft',
  [ACTIONS.registerFioAddress]: 'regaddress',
  [ACTIONS.registerFioDomain]: 'regdomain',
  [ACTIONS.addPublicAddresses]: 'addaddress',
  [ACTIONS.removeAllPublicAddresses]: 'remalladdr',
  [ACTIONS.removePublicAddresses]: 'remaddress',
  [ACTIONS.wrapFioTokens]: 'wraptokens',
  [ACTIONS.wrapFioDomain]: 'wrapdomain',
};

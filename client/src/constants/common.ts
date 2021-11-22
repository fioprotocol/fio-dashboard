import { ROUTES } from './routes';
import { NFTTokenItemProps } from '../types';

export const USER_STATUSES = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
};

export const DEFAULT_WALLET_OPTIONS = {
  name: 'My FIO',
  fiatCurrencyCode: 'iso:USD',
};
export const FIO_WALLET_TYPE = 'wallet:fio';
export const CONFIRM_PIN_ACTIONS = {
  RECOVERY: 'RECOVERY',
  PURCHASE: 'PURCHASE',
  TRANSFER: 'TRANSFER',
  SET_VISIBILITY: 'SET_VISIBILITY',
  RENEW: 'RENEW',
  SIGN_NFT: 'SIGN_NFT',
  RESEND_EMAIL: 'RESEND_EMAIL',
  PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
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

export const REF_ACTIONS = {
  SIGNNFT: 'SIGNNFT',
};

export const REF_ACTIONS_TO_ROUTES = {
  [REF_ACTIONS.SIGNNFT]: ROUTES.REF_SIGN_NFT,
};

export const REF_FLOW_STEPS = {
  INIT: 'INIT',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  REGISTRATION: 'REGISTRATION',
  ACTION: 'ACTION',
  FINISH: 'FINISH',
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

export const NFT_CHAIN_CODE_LIST = [
  'ADA',
  'ALGO',
  'BSC',
  'DGB',
  'EOS',
  'ETH',
  'FLOW',
  'MATIC',
  'SOL',
  'XTZ',
  'THETA',
  'TRX',
  'WAXP',
];

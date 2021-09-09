import { ROUTES } from './routes';

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
  [REF_ACTIONS.SIGNNFT]: ROUTES.SIGN_NFT,
};

export const REF_FLOW_STEPS = {
  INIT: 'INIT',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  REGISTRATION: 'REGISTRATION',
  ACTION: 'ACTION',
  FINISH: 'FINISH',
};

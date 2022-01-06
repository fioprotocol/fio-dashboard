import { ROUTES } from './routes';
import { NFTTokenItemProps } from '../types';

export const USER_STATUSES = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  NEW_EMAIL_NOT_VERIFIED: 'NEW_EMAIL_NOT_VERIFIED',
};

export const DEFAULT_WALLET_OPTIONS = {
  name: 'My FIO Wallet',
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
  DISABLE_PASSWORD_RECOVERY: 'DISABLE_PASSWORD_RECOVERY',
  CREATE_WALLET: 'CREATE_WALLET',
  IMPORT_WALLET: 'IMPORT_WALLET',
  SEND: 'SEND',
  UPDATE_EMAIL: 'UPDATE_EMAIL',
  DISABLE_TWO_FACTOR: 'DISABLE_TWO_FACTOR',
  ENABLE_TWO_FACTOR: 'ENABLE_TWO_FACTOR',
  TWO_FACTOR_REQUEST: 'TWO_FACTOR_REQUEST',
  SHOW_BACKUP_CODE: 'SHOW_BACKUP_CODE',
  ADD_TOKEN: 'ADD_TOKEN',
  DELETE_TOKEN: 'DELETE_TOKEN',
  EDIT_TOKEN: 'EDIT_TOKEN',
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

import {
  DEFAULT_FIO_TRX_ERR_MESSAGE,
  TOKEN_LINK_ERROR_MESSAGE,
  TOKEN_LINK_PARTIAL_ERROR_MESSAGE,
} from '../../../constants/errors';

export const ERROR_TYPES = {
  TRANSFER_ERROR: 'TRANSFER_ERROR',
  RENEW_ERROR: 'RENEW_ERROR',
  ADD_BUNDLES_ERROR: 'ADD_BUNDLES_ERROR',
  ADD_TOKEN_ERROR: 'ADD_TOKEN_ERROR',
  EDIT_TOKEN_ERROR: 'EDIT_TOKEN_ERROR',
  DELETE_TOKEN_ERROR: 'DELETE_TOKEN_ERROR',
  ADD_TOKEN_PARTIAL_ERROR: 'ADD_TOKEN_PARTIAL_ERROR',
  EDIT_TOKEN_PARTIAL_ERROR: 'EDIT_TOKEN_PARTIAL_ERROR',
  DELETE_TOKEN_PARTIAL_ERROR: 'DELETE_TOKEN_EPARTIAL_RROR',
};

const TOKEN_WORD_REPLACE = 'transfered';
const TOKEN_PARTIAL_ERROR_TITLE = 'Incomplete links';

export const ERROR_MESSAGES: {
  [action: string]: { title?: string; message?: string };
} = {
  [ERROR_TYPES.TRANSFER_ERROR]: {
    title: 'Transfer error',
    message: `${DEFAULT_FIO_TRX_ERR_MESSAGE}`
      .replace('purchase', 'transfer')
      .replace('registrations', 'transfer'),
  },
  [ERROR_TYPES.RENEW_ERROR]: {
    title: 'Renew error',
    message: `${DEFAULT_FIO_TRX_ERR_MESSAGE}`
      .replace('purchase', 'renew')
      .replace('registrations', 'renewal'),
  },
  [ERROR_TYPES.ADD_BUNDLES_ERROR]: {
    title: 'Add Bundled Transactions error',
    message: `${DEFAULT_FIO_TRX_ERR_MESSAGE}`.replace(
      ' and your registrations did not complete',
      '',
    ),
  },
  [ERROR_TYPES.ADD_TOKEN_ERROR]: {
    message: `${TOKEN_LINK_ERROR_MESSAGE}`.replace(
      TOKEN_WORD_REPLACE,
      'linked',
    ),
  },
  [ERROR_TYPES.EDIT_TOKEN_ERROR]: {
    message: `${TOKEN_LINK_ERROR_MESSAGE}`.replace(
      TOKEN_WORD_REPLACE,
      'edited',
    ),
  },
  [ERROR_TYPES.DELETE_TOKEN_ERROR]: {
    message: `${TOKEN_LINK_ERROR_MESSAGE}`.replace(
      TOKEN_WORD_REPLACE,
      'deleted',
    ),
  },
  [ERROR_TYPES.ADD_TOKEN_PARTIAL_ERROR]: {
    title: TOKEN_PARTIAL_ERROR_TITLE,
    message: `${TOKEN_LINK_ERROR_MESSAGE} ${TOKEN_LINK_PARTIAL_ERROR_MESSAGE}`.replace(
      TOKEN_WORD_REPLACE,
      'linked',
    ),
  },
  [ERROR_TYPES.EDIT_TOKEN_PARTIAL_ERROR]: {
    title: TOKEN_PARTIAL_ERROR_TITLE,
    message: `${TOKEN_LINK_ERROR_MESSAGE} ${TOKEN_LINK_PARTIAL_ERROR_MESSAGE}`.replace(
      TOKEN_WORD_REPLACE,
      'edited',
    ),
  },
  [ERROR_TYPES.DELETE_TOKEN_PARTIAL_ERROR]: {
    title: TOKEN_PARTIAL_ERROR_TITLE,
    message: `${TOKEN_LINK_ERROR_MESSAGE} ${TOKEN_LINK_PARTIAL_ERROR_MESSAGE}`.replace(
      TOKEN_WORD_REPLACE,
      'deleted',
    ),
  },
};

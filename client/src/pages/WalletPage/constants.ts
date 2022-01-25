import { IconName } from '@fortawesome/fontawesome-svg-core';

import { TransactionItemKeysProps } from './types';

export const TRANSACTION_ITEM_TYPES = {
  SENT: 'sent',
  RECEIVED: 'received',
  DATA: 'data',
};

export const INFO_BADGE_CONTENT = {
  [TRANSACTION_ITEM_TYPES.SENT]: {
    title: 'Sent',
    message: 'sent',
  },
  [TRANSACTION_ITEM_TYPES.RECEIVED]: {
    title: 'Received',
    message: 'received',
  },
  [TRANSACTION_ITEM_TYPES.DATA]: {
    title: 'FIO Data',
    message: 'FIO data',
  },
};

export const CONTENT_TYPE: {
  [key: string]: {
    icon: IconName;
    isGreen: boolean;
    isBlue: boolean;
    to?: string;
    from?: string;
  };
} = {
  [TRANSACTION_ITEM_TYPES.SENT]: {
    icon: 'arrow-up',
    isGreen: true,
    isBlue: false,
    to: 'To',
  },
  [TRANSACTION_ITEM_TYPES.RECEIVED]: {
    icon: 'arrow-down',
    isBlue: true,
    isGreen: false,
    from: 'From',
  },
};

export const DETAILED_ITEM_FIELDS: {
  [key: string]: TransactionItemKeysProps;
} = {
  amount: 'amount',
  chain: 'chain',
  date: 'date',
  from: 'from',
  memo: 'memo',
  payer: 'payer',
  requestor: 'requestor',
  to: 'to',
  type: 'type',
  txId: 'txId',
};

export const FIO_REQUEST_FIELDS_LIST = {
  SENT_LIST: [
    DETAILED_ITEM_FIELDS.type,
    DETAILED_ITEM_FIELDS.date,
    DETAILED_ITEM_FIELDS.requestor,
    DETAILED_ITEM_FIELDS.to,
    DETAILED_ITEM_FIELDS.amount,
    DETAILED_ITEM_FIELDS.chain,
    DETAILED_ITEM_FIELDS.memo,
  ],
  RECEIVED_LIST: [
    DETAILED_ITEM_FIELDS.type,
    DETAILED_ITEM_FIELDS.date,
    DETAILED_ITEM_FIELDS.from,
    DETAILED_ITEM_FIELDS.amount,
    DETAILED_ITEM_FIELDS.chain,
    DETAILED_ITEM_FIELDS.memo,
  ],
  PAYMENT_LIST: [
    DETAILED_ITEM_FIELDS.type,
    DETAILED_ITEM_FIELDS.date,
    DETAILED_ITEM_FIELDS.payer,
    DETAILED_ITEM_FIELDS.to,
    DETAILED_ITEM_FIELDS.amount,
    DETAILED_ITEM_FIELDS.chain,
    DETAILED_ITEM_FIELDS.txId,
    DETAILED_ITEM_FIELDS.memo,
  ],
  DATA_LIST: [
    DETAILED_ITEM_FIELDS.date,
    DETAILED_ITEM_FIELDS.amount,
    DETAILED_ITEM_FIELDS.from,
    DETAILED_ITEM_FIELDS.to,
    DETAILED_ITEM_FIELDS.chain,
    DETAILED_ITEM_FIELDS.txId,
    DETAILED_ITEM_FIELDS.memo,
  ],
};

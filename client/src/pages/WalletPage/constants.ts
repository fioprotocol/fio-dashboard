import { FioRecordViewKeysProps } from './types';

export const FIO_RECORD_TYPES = {
  SENT: 'sent',
  RECEIVED: 'received',
  DATA: 'data',
};

export const FIO_RECORD_DETAILED_TYPE = {
  REQUEST: 'Request',
  PAYMENT: 'Payment',
  RESULT: 'Result',
};

export const INFO_BADGE_CONTENT = {
  [FIO_RECORD_TYPES.SENT]: {
    title: 'Sent',
    message: 'sent',
  },
  [FIO_RECORD_TYPES.RECEIVED]: {
    title: 'Received',
    message: 'received',
  },
  [FIO_RECORD_TYPES.DATA]: {
    title: 'FIO Data',
    message: 'FIO data',
  },
};

export const CONTENT_TYPE: {
  [key: string]: {
    isGreen: boolean;
    isBlue: boolean;
    to: string | null;
    from: string | null;
  };
} = {
  [FIO_RECORD_TYPES.SENT]: {
    isGreen: true,
    isBlue: false,
    from: null,
    to: 'To',
  },
  [FIO_RECORD_TYPES.RECEIVED]: {
    isBlue: true,
    isGreen: false,
    from: 'From',
    to: null,
  },
};

export const FIO_RECORD_DETAILED_FIELDS: {
  [key: string]: FioRecordViewKeysProps;
} = {
  amount: 'amount',
  chainCode: 'chainCode',
  date: 'date',
  from: 'from',
  memo: 'memo',
  to: 'to',
  type: 'type',
  obtId: 'obtId',
};

export const FIO_REQUEST_FIELDS_LIST = {
  SENT_LIST: [
    FIO_RECORD_DETAILED_FIELDS.type,
    FIO_RECORD_DETAILED_FIELDS.date,
    FIO_RECORD_DETAILED_FIELDS.from,
    FIO_RECORD_DETAILED_FIELDS.to,
    FIO_RECORD_DETAILED_FIELDS.amount,
    FIO_RECORD_DETAILED_FIELDS.chainCode,
    FIO_RECORD_DETAILED_FIELDS.memo,
  ],
  RECEIVED_LIST: [
    FIO_RECORD_DETAILED_FIELDS.type,
    FIO_RECORD_DETAILED_FIELDS.date,
    FIO_RECORD_DETAILED_FIELDS.from,
    FIO_RECORD_DETAILED_FIELDS.amount,
    FIO_RECORD_DETAILED_FIELDS.chainCode,
    FIO_RECORD_DETAILED_FIELDS.memo,
  ],
  PAYMENT_LIST: [
    FIO_RECORD_DETAILED_FIELDS.type,
    FIO_RECORD_DETAILED_FIELDS.date,
    FIO_RECORD_DETAILED_FIELDS.from,
    FIO_RECORD_DETAILED_FIELDS.to,
    FIO_RECORD_DETAILED_FIELDS.amount,
    FIO_RECORD_DETAILED_FIELDS.chainCode,
    FIO_RECORD_DETAILED_FIELDS.obtId,
    FIO_RECORD_DETAILED_FIELDS.memo,
  ],
  DATA_LIST: [
    FIO_RECORD_DETAILED_FIELDS.date,
    FIO_RECORD_DETAILED_FIELDS.amount,
    FIO_RECORD_DETAILED_FIELDS.from,
    FIO_RECORD_DETAILED_FIELDS.to,
    FIO_RECORD_DETAILED_FIELDS.chainCode,
    FIO_RECORD_DETAILED_FIELDS.obtId,
    FIO_RECORD_DETAILED_FIELDS.memo,
  ],
  REJECT_REQUEST_LIST: [
    FIO_RECORD_DETAILED_FIELDS.type,
    FIO_RECORD_DETAILED_FIELDS.date,
    FIO_RECORD_DETAILED_FIELDS.from,
    FIO_RECORD_DETAILED_FIELDS.amount,
    FIO_RECORD_DETAILED_FIELDS.chainCode,
  ],
  REJECT_REQUEST_RESULTS_LIST: [
    FIO_RECORD_DETAILED_FIELDS.from,
    FIO_RECORD_DETAILED_FIELDS.to,
    FIO_RECORD_DETAILED_FIELDS.amount,
    FIO_RECORD_DETAILED_FIELDS.chainCode,
    FIO_RECORD_DETAILED_FIELDS.obtId,
  ],
  CANCEL_REQUEST_LIST: [
    FIO_RECORD_DETAILED_FIELDS.type,
    FIO_RECORD_DETAILED_FIELDS.date,
    FIO_RECORD_DETAILED_FIELDS.to,
    FIO_RECORD_DETAILED_FIELDS.amount,
    FIO_RECORD_DETAILED_FIELDS.chainCode,
    FIO_RECORD_DETAILED_FIELDS.memo,
  ],
  CANCEL_REQUEST_RESULTS_LIST: [
    FIO_RECORD_DETAILED_FIELDS.from,
    FIO_RECORD_DETAILED_FIELDS.to,
    FIO_RECORD_DETAILED_FIELDS.amount,
    FIO_RECORD_DETAILED_FIELDS.chainCode,
    FIO_RECORD_DETAILED_FIELDS.obtId,
    FIO_RECORD_DETAILED_FIELDS.memo,
  ],
};

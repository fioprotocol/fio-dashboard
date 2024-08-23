import { ACTIONS } from './fio';

import { PurchaseTxStatus, ColorTypes } from '../types';

export const FREE_STATUS: { [label: string]: number } = {
  IS_FREE: 1,
  IS_PAID: 2,
};

export const PURCHASE_RESULTS_STATUS: { [label: string]: number } = {
  NEW: 1,
  PENDING: 2,
  PAYMENT_AWAITING: 3,
  PAID: 4,
  TRANSACTION_PENDING: 5,
  PARTIALLY_SUCCESS: 6,
  SUCCESS: 7,
  FAILED: 8,
  CANCELED: 9,
  PAYMENT_PENDING: 10,
} as const;

export const PAYMENT_RESULTS_STATUS: { [label: string]: number } = {
  NEW: 1,
  PENDING: 2,
  COMPLETED: 3,
  EXPIRED: 4,
  CANCELLED: 5,
};

export const PURCHASE_RESULTS_STATUS_LABELS: {
  [key: number]: string;
} = Object.entries(PURCHASE_RESULTS_STATUS).reduce((acc, [label, value]) => {
  const transformedLabel = label.toLowerCase().replace('_', ' ');
  acc[value] =
    transformedLabel.charAt(0).toUpperCase() + transformedLabel.slice(1);
  return acc;
}, {} as { [key: number]: string });

export const ORDER_STATUS_LABELS: {
  [key: PurchaseTxStatus | string]: {
    title: string;
    color: ColorTypes;
  };
} = {
  [PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS]: {
    title: 'PARTIAL',
    color: {
      isBlueGreen: true,
    },
  },
  [PURCHASE_RESULTS_STATUS.SUCCESS]: {
    title: 'COMPLETE',
    color: {
      isGreen: true,
    },
  },
  [PURCHASE_RESULTS_STATUS.CANCELED]: {
    title: 'CANCELED',
    color: {
      isOrange: true,
    },
  },
  [PURCHASE_RESULTS_STATUS.FAILED]: {
    title: 'FAILED',
    color: {
      isRed: true,
    },
  },
  DEAFULT: {
    title: 'IN PROGRESS',
    color: {
      isRose: true,
    },
  },
};

export const ORDER_STATUS_LABEL_PDF = {
  [PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS]: 'Transaction Partially Complete',
  [PURCHASE_RESULTS_STATUS.SUCCESS]: 'Transaction Complete',
  [PURCHASE_RESULTS_STATUS.FAILED]: 'Transaction Failed',
  [PURCHASE_RESULTS_STATUS.CANCELED]: 'Transaction Canceled',
  DEFAULT: 'Transaction in Progress',
};

export const PAYMENT_PROVIDER = {
  FIO: 'FIO',
  STRIPE: 'STRIPE',
  BITPAY: 'BITPAY',
} as const;

export const PAYMENT_PROVIDER_LABEL = {
  [PAYMENT_PROVIDER.FIO]: 'Fio Wallet',
  [PAYMENT_PROVIDER.STRIPE]: 'Stripe',
  [PAYMENT_PROVIDER.BITPAY]: 'BitPay',
};

export const PAYMENT_ITEM_TYPE_LABEL = {
  [ACTIONS.registerFioAddress]: 'FCH',
  [ACTIONS.registerFioDomain]: 'Domain',
  [ACTIONS.registerFioDomainAddress]: 'DomainFCH',
  [ACTIONS.addBundledTransactions]: 'Add Bundled Transactions',
  [ACTIONS.renewFioDomain]: 'Domain Renewal',
};

export const PAYMENT_STATUSES = {
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
} as const;

export const PAYMENTS_STATUSES_TITLES = {
  [PAYMENT_STATUSES.NEW]: 'NEW',
  [PAYMENT_STATUSES.PENDING]: 'PENDING',
  [PAYMENT_STATUSES.COMPLETED]: 'COMPLETED',
  [PAYMENT_STATUSES.EXPIRED]: 'EXPIRED',
  [PAYMENT_STATUSES.CANCELLED]: 'CANCELLED',
  [PAYMENT_STATUSES.FAILED]: 'FAILED',
  [PAYMENT_STATUSES.PENDING_PAID]: 'PENDING (PAID)',
  [PAYMENT_STATUSES.PENDING_CONFIRMED]: 'PENDING (CONFIRMED)',
  [PAYMENT_STATUSES.USER_ACTION_PENDING]: 'PENDING USER ACTION',
  [PAYMENT_STATUSES.INSUFFICIENT_FUNDS]: 'USER HAS INSUFFICIENT FUNDS',
  [PAYMENT_STATUSES.CHARGE_FAILED]: 'CHARGE FAILED',
  [PAYMENT_STATUSES.BLOCKED]: 'PAYMENT HAS BEEN BLOCKED',
};

export const PAYMENT_OPTIONS = {
  FIO: 'FIO',
  CREDIT_CARD: 'CREDIT_CARD',
  CRYPTO: 'CRYPTO',
} as const;

export const PAYMENT_OPTIONS_LABEL = {
  [PAYMENT_OPTIONS.FIO]: 'FIO',
  [PAYMENT_OPTIONS.CREDIT_CARD]: 'Credit Card',
  [PAYMENT_OPTIONS.CRYPTO]: 'Crypto',
};
export const PAYMENT_PROVIDER_PAYMENT_OPTION = {
  [PAYMENT_PROVIDER.FIO]: PAYMENT_OPTIONS.FIO,
  [PAYMENT_PROVIDER.STRIPE]: PAYMENT_OPTIONS.CREDIT_CARD,
  [PAYMENT_PROVIDER.BITPAY]: PAYMENT_OPTIONS.CRYPTO,
};

export const PAYMENT_SPENT_TYPES = {
  ORDER: 1,
  ACTION: 2,
  ACTION_REFUND: 3,
  ORDER_REFUND: 4,
} as const;

export const PAYMENT_OPTION_TITLE = {
  [PAYMENT_OPTIONS.FIO]: 'Pay with FIO',
  [PAYMENT_OPTIONS.CREDIT_CARD]: 'Pay with card',
  [PAYMENT_OPTIONS.CRYPTO]: 'Pay with crypto',
};

export const PAYMENT_PROVIDER_PAYMENT_TITLE = {
  [PAYMENT_PROVIDER.FIO]: PAYMENT_OPTION_TITLE.FIO,
  [PAYMENT_PROVIDER.STRIPE]: PAYMENT_OPTION_TITLE.CREDIT_CARD,
  [PAYMENT_PROVIDER.BITPAY]: PAYMENT_OPTION_TITLE.CRYPTO,
};

export const BC_TX_STATUSES = {
  NONE: 0,
  READY: 1,
  PENDING: 2,
  SUCCESS: 3,
  FAILED: 4,
  CANCEL: 5,
  RETRY: 6,
  EXPIRE: 7,
  RETRY_PROCESSED: 8,
};

export const BC_TX_STATUS_LABELS = {
  [BC_TX_STATUSES.NONE]: 'None',
  [BC_TX_STATUSES.READY]: 'Ready',
  [BC_TX_STATUSES.PENDING]: 'Pending',
  [BC_TX_STATUSES.CANCEL]: 'Cancelled',
  [BC_TX_STATUSES.FAILED]: 'Failed',
  [BC_TX_STATUSES.SUCCESS]: 'Success',
  [BC_TX_STATUSES.RETRY]: 'Retry',
  [BC_TX_STATUSES.EXPIRE]: 'Expired',
};

export const PAYMENT_SPENT_TYPES_ORDER_HISTORY_LABEL = {
  [PAYMENT_SPENT_TYPES.ORDER]: 'Payment for ',
  [PAYMENT_SPENT_TYPES.ACTION]: 'Charge for ',
  [PAYMENT_SPENT_TYPES.ACTION_REFUND]: 'Discharge for ',
  [PAYMENT_SPENT_TYPES.ORDER_REFUND]: 'Refund to ',
} as const;

export const PURCHASE_RESULTS_TITLES: { [key: number]: { title: string } } = {
  [PURCHASE_RESULTS_STATUS.SUCCESS]: {
    title: 'Purchased!',
  },
  [PURCHASE_RESULTS_STATUS.FAILED]: {
    title: 'Failed!',
  },
  [PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS]: {
    title: 'Purchased!',
  },
  [PURCHASE_RESULTS_STATUS.PENDING]: {
    title: 'In Progress!',
  },
  [PURCHASE_RESULTS_STATUS.PAYMENT_PENDING]: {
    title: 'In Progress!',
  },
  [PURCHASE_RESULTS_STATUS.CANCELED]: {
    title: 'Canceled!',
  },
};

export const STRIPE_REDIRECT_STATUSES = {
  FAILED: 'failed',
  SUCCEEDED: 'succeeded',
};

export const PURCHASE_RESULTS_STATUS = {
  NEW: 1,
  PENDING: 2,
  PAYMENT_AWAITING: 3,
  PAID: 4,
  TRANSACTION_EXECUTED: 5,
  PARTIALLY_SUCCESS: 6,
  DONE: 7,
  FAILED: 8,
  CANCELED: 9,
} as const;

export const PURCHASE_PROVIDER = {
  FIO: 'fio',
  STRIPE: 'stripe',
  CRYPTO: 'crypto',
} as const;

export const PURCHASE_PROVIDER_LABEL = {
  [PURCHASE_PROVIDER.FIO]: 'Fio Wallet',
  [PURCHASE_PROVIDER.STRIPE]: 'Stripe',
  [PURCHASE_PROVIDER.CRYPTO]: 'Crypto',
};

export const PAYMENT_OPTIONS = {
  FIO: 'fio',
  CREDIT_CARD: 'creditCard',
  CRYPTO: 'crypto',
} as const;

export const PURCHASE_RESULTS_TITLES: { [key: number]: { title: string } } = {
  [PURCHASE_RESULTS_STATUS.DONE]: {
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
  [PURCHASE_RESULTS_STATUS.CANCELED]: {
    title: 'Canceled!',
  },
};

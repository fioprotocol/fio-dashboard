import { IconName } from '@fortawesome/fontawesome-svg-core';

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

export const STATUS_TYPES: { [key: string]: string } = {
  REJECTED: 'rejected',
  PAID: 'paid',
  PENDING: 'pending',
};

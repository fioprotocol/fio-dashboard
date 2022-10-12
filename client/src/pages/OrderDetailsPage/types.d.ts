import { ReactNode } from 'react';

import {
  OrderDetailed,
  OrderItemDetailed,
  PaymentCurrency,
  PaymentProvider,
} from '../../types';

export type ErrBadgesProps = {
  [badgeKey: string]: {
    total: string;
    totalCurrency: string;
    errorType: string;
    items: OrderItemDetailed[];
  };
};

export type OrderDetailsProps = {
  buttonText?: string;
  actionClick?: () => void;
  orderItem: OrderDetailed;
};

export type TotalCost = {
  convertedPaymentAmount?: string;
  convertedPaymentCurrency?: PaymentCurrency;
  costFree?: string;
  paymentAmount: string;
  paymentCurrency?: PaymentCurrency;
};

export type InfoBadgeData = {
  failedTxsTotalAmount?: string;
  failedTxsTotalCurrency?: PaymentCurrency;
  paymentProvider: PaymentProvider;
  purchaseStatus: number;
};

export type ContextProps = {
  actionButtonProps: {
    text: string;
    onClick: () => void;
  };
  infoBadgeData: InfoBadgeData;
  isPartial: boolean;
  isAllErrored: boolean;
  title: ReactNode;
  paymentInfo: {
    orderNumber: string;
    paidWith?: string;
    totalCost: TotalCost;
  };
  orderItemsToRender: OrderItemDetailed[];
  partialErrorItems: OrderItemDetailed[];
  partialErrorTotalCost: TotalCost;
  errorBadges: ErrBadgesProps;
};

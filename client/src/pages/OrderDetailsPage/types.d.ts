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
  disabled?: boolean;
  hideTopCloseButton?: boolean;
  orderItem: OrderDetailed;
};

export type TotalCost = {
  fioNativeTotalPrice?: string;
  freeTotalPrice?: string;
  usdcTotalPrice?: string;
};

export type InfoBadgeData = {
  paymentProvider: PaymentProvider;
  purchaseStatus: number;
};

export type ContextProps = {
  actionButtonProps: {
    disabled?: boolean;
    hideTopCloseButton?: boolean;
    text: string;
    onClick: () => void;
  };
  infoBadgeData: InfoBadgeData;
  isPartial: boolean;
  isAllErrored: boolean;
  hideTopCloseButton?: boolean;
  title: ReactNode;
  paymentInfo: {
    orderNumber: string;
    paidWith?: string;
    totalCostPrice: string;
    paymentCurrency: PaymentCurrency;
  };
  orderItemsToRender: OrderItemDetailed[];
  partialErrorItems: OrderItemDetailed[];
  partialErrorTotalCost: string;
  errorBadges: ErrBadgesProps;
};

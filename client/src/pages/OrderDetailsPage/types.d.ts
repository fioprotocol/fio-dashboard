import { ReactNode } from 'react';

import {
  ErrBadgesProps,
  OrderDetailed,
  OrderItemDetailed,
  OrderDetailedTotalCost,
  PaymentProvider,
  PaymentStatus,
} from '../../types';

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
  paymentStatus: PaymentStatus;
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
    totalCostPrice: OrderDetailedTotalCost;
  };
  orderItemsToRender: OrderItemDetailed[];
  partialErrorItems: OrderItemDetailed[];
  partialErrorTotalCost: OrderDetailedTotalCost;
  errorBadges: ErrBadgesProps;
};

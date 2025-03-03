import { ReactNode } from 'react';

import {
  ErrBadgesProps,
  OrderDetailed,
  OrderItemDetailed,
  OrderDetailedTotalCost,
  PaymentProvider,
  PaymentStatus,
  Roe,
} from '../../types';

export type OrderDetailsProps = {
  buttonText?: string;
  actionClick?: () => void;
  disabled?: boolean;
  hideTopCloseButton?: boolean;
  orderItem: OrderDetailed;
};

export type InfoBadgeData = {
  paymentProvider: PaymentProvider;
  purchaseStatus: number;
  paymentStatus: PaymentStatus;
};

export type PaymentInfo = {
  publicKey: string;
  orderNumber: string;
  paidWith?: string;
  totalFioNativeCostPrice?: string;
  isFree?: boolean;
  roe?: Roe;
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
  isRetryAvailable: boolean;
  hideTopCloseButton?: boolean;
  title: ReactNode;
  paymentInfo: PaymentInfo[];
  orderItemsToRender: OrderItemDetailed[];
  partialErrorItems: OrderItemDetailed[];
  partialErrorTotalCost: OrderDetailedTotalCost;
  errorBadges: ErrBadgesProps;
};

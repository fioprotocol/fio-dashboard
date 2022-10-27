import React from 'react';
import { isDesktop as isDesktopBrowser } from 'react-device-detect';

import { OrderItem } from '../OrderItem/OrderItem';
import { OrderItemMobileView } from '../OrderItemMobileView';

import { commonFormatTime } from '../../../../util/general';

import {
  ORDER_STATUS_LABELS,
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../../constants/purchase';

import { UserOrderDetails } from '../../../../types';
import { ActionsProps } from '../../types';

type OrderItemRenderProps = {
  key: string;
  isDesktop: boolean;
  orderItem: UserOrderDetails;
} & ActionsProps;

export const OrderItemRender: React.FC<OrderItemRenderProps> = props => {
  const { isDesktop, orderItem, onDownloadClick, onPrintClick } = props;
  const {
    createdAt,
    status,
    payment: { paymentProcessor },
  } = orderItem;

  const statusTitle =
    ORDER_STATUS_LABELS[status]?.title || ORDER_STATUS_LABELS.DEAFULT.title;
  const statusColor =
    ORDER_STATUS_LABELS[status]?.color || ORDER_STATUS_LABELS.DEAFULT.color;

  const showFioPrice = paymentProcessor === PAYMENT_PROVIDER.FIO;

  const date = commonFormatTime(createdAt);

  const isSuccessOrPartialStatus =
    status === PURCHASE_RESULTS_STATUS.SUCCESS ||
    status === PURCHASE_RESULTS_STATUS.PARTIALLY_SUCCESS;

  const orderProps = {
    ...orderItem,
    date,
    hidePrintButton: !isSuccessOrPartialStatus || !isDesktopBrowser,
    hidePdfButton: !isSuccessOrPartialStatus,
    showFioPrice,
    statusTitle,
    statusColor,
    onDownloadClick,
    onPrintClick,
  };

  if (isDesktop) return <OrderItem {...orderProps} />;

  return <OrderItemMobileView {...orderProps} />;
};

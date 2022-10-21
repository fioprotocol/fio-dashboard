import React from 'react';

import { OrderItem } from '../OrderItem/OrderItem';
import { OrderItemMobileView } from '../OrderItemMobileView';

import { commonFormatTime } from '../../../../util/general';

import {
  ORDER_STATUS_LABELS,
  PAYMENT_PROVIDER,
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

  const orderProps = {
    ...orderItem,
    date,
    showFioPrice,
    statusTitle,
    statusColor,
    onDownloadClick,
    onPrintClick,
  };

  if (isDesktop) return <OrderItem {...orderProps} />;

  return <OrderItemMobileView {...orderProps} />;
};

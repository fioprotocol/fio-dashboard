import React from 'react';

import CommonBadge from '../../../../components/Badges/CommonBadge/CommonBadge';

import { OrderItemAmount } from '../OrderItemAmount';
import { OrderItemActions } from '../OrderItemActions/OrderItemActions';

import { OrderItemProps } from '../../types';

import classes from './OrderItemMobileView.module.scss';

export const OrderItemMobileView: React.FC<OrderItemProps> = props => {
  const {
    date,
    id,
    disablePrintButton,
    disablePdfButton,
    number,
    roe,
    payment: { paidWith } = {},
    statusTitle,
    statusColor,
    total,
    onDownloadClick,
    onPrintClick,
  } = props;

  return (
    <div className={classes.container}>
      <div className={classes.orderNumber}>{number}</div>
      <div className={classes.defaultItem}>{date}</div>
      <div className={classes.defaultItem}>
        <OrderItemAmount total={total} roe={roe} />
      </div>
      <div className={classes.defaultItem}>{paidWith ?? 'N/A'}</div>
      <div className={classes.status}>
        <CommonBadge {...statusColor}>
          <div className={classes.statusTitle}>{statusTitle}</div>
        </CommonBadge>
      </div>
      <div className={classes.actionsContainer}>
        <OrderItemActions
          orderId={id}
          orderNumber={number}
          disablePrintButton={disablePrintButton}
          disablePdfButton={disablePdfButton}
          onDownloadClick={onDownloadClick}
          onPrintClick={onPrintClick}
        />
      </div>
    </div>
  );
};

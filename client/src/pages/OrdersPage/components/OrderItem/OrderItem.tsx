import React from 'react';
import classnames from 'classnames';

import CommonBadge from '../../../../components/Badges/CommonBadge/CommonBadge';

import { OrderItemActions } from '../OrderItemActions/OrderItemActions';
import { OrderItemAmount } from '../OrderItemAmount';

import { OrderItemProps } from '../../types';

import classes from './OrderItem.module.scss';

export const OrderItem: React.FC<OrderItemProps> = props => {
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
    <React.Fragment>
      <div className={classnames(classes.tableCol, classes.firstCol)}>
        {date}
      </div>
      <div className={classes.tableCol}>{number}</div>
      <div className={classes.tableCol}>
        <OrderItemAmount total={total} roe={roe} />
      </div>
      <div className={classes.tableCol}>{paidWith ?? 'N/A'}</div>
      <div className={classes.tableCol}>
        <CommonBadge {...statusColor} hasRoundBorders>
          <span className={classes.status}>{statusTitle}</span>
        </CommonBadge>
      </div>
      <div className={classnames(classes.tableCol, classes.lastCol)}>
        <OrderItemActions
          orderId={id}
          orderNumber={number}
          onDownloadClick={onDownloadClick}
          onPrintClick={onPrintClick}
          disablePrintButton={disablePrintButton}
          disablePdfButton={disablePdfButton}
        />
      </div>
    </React.Fragment>
  );
};

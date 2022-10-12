import React from 'react';
import classnames from 'classnames';

import CommonBadge from '../../../../components/Badges/CommonBadge/CommonBadge';

import { OrderItemActions } from '../OrderItemActions/OrderItemActions';
import { OrderItemAmount } from '../OrderItemAmount';

import { commonFormatTime } from '../../../../util/general';

import {
  ORDER_STATUS_LABELS,
  PAYMENT_PROVIDER,
} from '../../../../constants/purchase';

import { UserOrderDetails } from '../../../../types';

import classes from './OrderItem.module.scss';

type Props = {
  onDownloadClick: (orderId: string) => void;
  onPrintClick: (orderId: string) => void;
};

export const OrderItem: React.FC<Props & UserOrderDetails> = props => {
  const {
    createdAt,
    id,
    number,
    roe,
    payment: { paidWith, paymentProcessor },
    status,
    total,
    onDownloadClick,
    onPrintClick,
  } = props;

  const statusTitle =
    ORDER_STATUS_LABELS[status]?.title || ORDER_STATUS_LABELS.DEAFULT.title;
  const statusColor =
    ORDER_STATUS_LABELS[status]?.color || ORDER_STATUS_LABELS.DEAFULT.color;

  return (
    <React.Fragment>
      <div className={classnames(classes.tableCol, classes.firstCol)}>
        {commonFormatTime(createdAt)}
      </div>
      <div className={classes.tableCol}>{number}</div>
      <div className={classes.tableCol}>
        <OrderItemAmount
          total={total}
          roe={roe}
          showFioPrice={paymentProcessor === PAYMENT_PROVIDER.FIO}
        />
      </div>
      <div className={classes.tableCol}>{paidWith}</div>
      <div className={classes.tableCol}>
        <CommonBadge {...statusColor}>
          <span className={classes.status}>{statusTitle}</span>
        </CommonBadge>
      </div>
      <div className={classnames(classes.tableCol, classes.lastCol)}>
        <OrderItemActions
          orderId={id}
          orderNumber={number}
          onDownloadClick={onDownloadClick}
          onPrintClick={onPrintClick}
        />
      </div>
    </React.Fragment>
  );
};

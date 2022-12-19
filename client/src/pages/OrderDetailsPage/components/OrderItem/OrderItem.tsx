import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';

import CartItem from '../../../../components/Cart/CartItem';

import apis from '../../../../api';

import MathOp from '../../../../util/math';

import { OrderItemDetailed, PaymentCurrency } from '../../../../types';

import classes from './OrderItem.module.scss';

type Props = {
  primaryCurrency: PaymentCurrency;
} & OrderItemDetailed;

export const OrderItem: React.FC<Props> = props => {
  const {
    address,
    hasCustomDomain,
    domain,
    type,
    period,
    id,
    fee_collected,
    costUsdc,
    primaryCurrency,
    transaction_ids,
  } = props;

  const item = {
    address,
    domain,
    type,
    period,
    costFio: apis.fio.sufToAmount(fee_collected).toFixed(2),
    costUsdc,
    costNativeFio: fee_collected ? new MathOp(fee_collected).toNumber() : null,
    id,
    hasCustomDomain,
  };

  return (
    <>
      <CartItem item={item} primaryCurrency={primaryCurrency} />
      {transaction_ids?.length > 0 &&
        transaction_ids.map(transaction_id => (
          <Badge
            key={transaction_id}
            type={BADGE_TYPES.WHITE}
            show={!!transaction_id}
            className="mt-3"
          >
            <div className={classes.item}>
              <span className={classnames(classes.name, 'boldText')}>
                Transaction ID
              </span>
              <p className={classes.itemValue}>
                <a
                  href={`${process.env.REACT_APP_FIO_BLOCKS_TX_URL}${transaction_id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="boldText">{transaction_id}</span>
                </a>
              </p>
            </div>
          </Badge>
        ))}
    </>
  );
};

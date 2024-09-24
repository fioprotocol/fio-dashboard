import { FC } from 'react';
import classnames from 'classnames';

import { FIOSDK } from '@fioprotocol/fiosdk';

import Badge from '../../../../components/Badge/Badge';
import CartItem from '../../../../components/Cart/CartItem';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { DOMAIN_TYPE } from '../../../../constants/fio';

import MathOp from '../../../../util/math';

import { OrderItemDetailed } from '../../../../types';

import classes from './OrderItem.module.scss';

type Props = OrderItemDetailed & {
  isEditable?: boolean;
};

export const OrderItem: FC<Props> = props => {
  const {
    address,
    hasCustomDomain,
    domain,
    type,
    period,
    id,
    isFree,
    fee_collected,
    costUsdc,
    transaction_ids,
    isEditable,
  } = props;

  const item = {
    address,
    domain,
    type,
    period,
    costFio: FIOSDK.SUFToAmount(fee_collected).toFixed(2),
    costUsdc,
    costNativeFio: fee_collected ? new MathOp(fee_collected).toNumber() : null,
    id,
    isFree,
    hasCustomDomain,
    domainType: hasCustomDomain
      ? DOMAIN_TYPE.CUSTOM
      : fee_collected
      ? DOMAIN_TYPE.PREMIUM
      : DOMAIN_TYPE.ALLOW_FREE,
  };

  return (
    <>
      <CartItem item={item} isEditable={isEditable} />
      {transaction_ids?.length > 0 &&
        transaction_ids
          .filter(transaction_id => !!transaction_id)
          .map(transaction_id => (
            <Badge
              key={transaction_id}
              type={BADGE_TYPES.SIMPLE}
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

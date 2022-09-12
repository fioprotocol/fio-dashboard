import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Amount from '../common/Amount';
import Badge, { BADGE_TYPES } from '../Badge/Badge';

import { CURRENCY_CODES } from '../../constants/common';

import { CartItem as CartItemType, PaymentCurrency } from '../../types';

import classes from './Cart.module.scss';

type Props = {
  item: CartItemType;
  primaryCurrency?: PaymentCurrency;
  onDelete?: (id: string) => void;
};

type CartItemProps = {
  primaryCurrency: PaymentCurrency;
  costFio: string;
  costUsdc: string;
  costNativeFio?: number;
};

const CartItemPrice = (props: CartItemProps) => {
  const { costFio, costUsdc, costNativeFio, primaryCurrency } = props;

  if (!costNativeFio) return <span className="boldText">FREE</span>;

  if (primaryCurrency === CURRENCY_CODES.FIO)
    return (
      <>
        <span className="boldText">
          <Amount value={costFio} /> FIO
        </span>{' '}
        (
        <Amount value={costUsdc} /> USDC)
      </>
    );

  return (
    <>
      <span className="boldText">
        <Amount value={costUsdc} /> USDC
      </span>{' '}
      (
      <Amount value={costFio} /> FIO)
    </>
  );
};

const CartItem: React.FC<Props> = props => {
  const { item, primaryCurrency = CURRENCY_CODES.FIO, onDelete } = props;

  const {
    address,
    domain,
    costFio,
    costUsdc,
    costNativeFio,
    showBadge,
    hasCustomDomain,
  } = item;

  return (
    <>
      <Badge show type={BADGE_TYPES.WHITE}>
        <div className={classes.itemContainer}>
          {item.address ? (
            <span className={classes.address}>
              <span className="boldText">{address}@</span>
              <span className={hasCustomDomain && 'boldText'}>{domain}</span>
            </span>
          ) : (
            <span className="boldText">{domain && domain}</span>
          )}
          <p
            className={classnames(
              classes.price,
              onDelete && classes.deletePrice,
            )}
          >
            <CartItemPrice
              primaryCurrency={primaryCurrency}
              costFio={costFio}
              costUsdc={costUsdc}
              costNativeFio={costNativeFio}
            />
          </p>
          {onDelete && (
            <FontAwesomeIcon
              icon="times-circle"
              className={classes.icon}
              onClick={() => onDelete(item.id)}
            />
          )}
        </div>
      </Badge>
      {showBadge && (
        <Badge show type={BADGE_TYPES.INFO}>
          <div className={classes.infoBadge}>
            <FontAwesomeIcon
              icon="exclamation-circle"
              className={classes.infoIcon}
            />
            <p className={classes.infoText}>
              <span className="boldText">FIO Crypto Handle Cost</span> - Your
              account already has a free FIO Crypto Handle associated with it.
            </p>
          </div>
        </Badge>
      )}
    </>
  );
};

export default CartItem;

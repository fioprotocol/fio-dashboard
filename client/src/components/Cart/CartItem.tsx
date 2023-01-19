import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Amount from '../common/Amount';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import CustomDropdown from '../CustomDropdown';

import {
  CART_ITEM_PERIOD_OPTIONS,
  CART_ITEM_TYPES_WITH_PERIOD,
  CURRENCY_CODES,
} from '../../constants/common';

import { getCartItemDescriptor } from '../../util/cart';

import { CartItem as CartItemType, PaymentCurrency } from '../../types';

import classes from './Cart.module.scss';

type Props = {
  item: CartItemType;
  primaryCurrency?: PaymentCurrency;
  onDelete?: (id: string) => void;
  onUpdatePeriod?: (id: string, period: number) => void;
  isPeriodEditable?: boolean;
};

export type CartItemProps = {
  primaryCurrency?: PaymentCurrency;
  costFio: string;
  costUsdc: string;
  costNativeFio?: number;
};

export const CartItemPrice = (props: CartItemProps) => {
  const {
    costFio,
    costUsdc,
    costNativeFio,
    primaryCurrency = CURRENCY_CODES.FIO,
  } = props;

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
  const {
    item,
    primaryCurrency = CURRENCY_CODES.FIO,
    onDelete,
    onUpdatePeriod,
    isPeriodEditable = false,
  } = props;

  const {
    address,
    domain,
    costFio,
    costUsdc,
    costNativeFio,
    showBadge,
    hasCustomDomain,
    period,
    type,
  } = item;
  const shouldShowPeriod =
    isPeriodEditable && CART_ITEM_TYPES_WITH_PERIOD.includes(type);
  const onPeriodChange = useCallback(
    (value: string) => {
      onUpdatePeriod && onUpdatePeriod(item.id, +value);
    },
    [item, onUpdatePeriod],
  );

  return (
    <>
      <Badge
        show
        type={BADGE_TYPES.WHITE}
        className={shouldShowPeriod && classes.itemWithPeriod}
      >
        <div className={classes.itemContainer}>
          <div className={classes.itemNameContainer}>
            {item.address ? (
              <span className={classes.address}>
                <span className="boldText">{address}@</span>
                <span className={hasCustomDomain && 'boldText'}>{domain}</span>
              </span>
            ) : (
              <span className="boldText">{domain && domain}</span>
            )}
            <span className={classes.descriptor}>
              {getCartItemDescriptor(item.type, item.period)}
            </span>
          </div>
          {shouldShowPeriod && (
            <div className={classes.period}>
              <CustomDropdown
                value={period.toString()}
                options={CART_ITEM_PERIOD_OPTIONS}
                onChange={onPeriodChange}
                isDark
              />
            </div>
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

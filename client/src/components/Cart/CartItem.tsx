import React, { useCallback } from 'react';
import classnames from 'classnames';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';

import Badge, { BADGE_TYPES } from '../Badge/Badge';
import CustomDropdown from '../CustomDropdown';
import { PriceComponent } from '../PriceComponent';

import {
  CART_ITEM_PERIOD_OPTIONS,
  CART_ITEM_TYPES_WITH_PERIOD,
} from '../../constants/common';
import { FIO_ADDRESS_DELIMITER } from '../../utils';

import { getCartItemDescriptor } from '../../util/cart';

import { CartItem as CartItemType, DomainItemType } from '../../types';

import classes from './Cart.module.scss';

type Props = {
  item: CartItemType;
  onDelete?: (cartItem: CartItemType) => void;
  onUpdatePeriod?: (data: {
    cartItem: CartItemType;
    newPeriod: number;
  }) => void;
  isEditable?: boolean;
  isPeriodEditable?: boolean;
};

export type CartItemProps = {
  costFio: string;
  costUsdc: string;
  costNativeFio?: number;
  domainType?: DomainItemType;
  isFree?: boolean;
};

export const CartItemPrice = (props: CartItemProps) => {
  const { costFio, costUsdc, isFree } = props;

  return (
    <PriceComponent costFio={costFio} costUsdc={costUsdc} isFree={isFree} />
  );
};

const CartItem: React.FC<Props> = props => {
  const {
    item,
    onDelete,
    onUpdatePeriod,
    isPeriodEditable = false,
    isEditable,
  } = props;

  const {
    address,
    domain,
    costFio,
    costUsdc,
    costNativeFio,
    hasCustomDomainInCart,
    isFree,
    showBadge,
    period,
    type,
    domainType,
  } = item;
  const shouldShowPeriod =
    isPeriodEditable &&
    CART_ITEM_TYPES_WITH_PERIOD.includes(type) &&
    !hasCustomDomainInCart;
  const onPeriodChange = useCallback(
    (value: string) => {
      onUpdatePeriod && onUpdatePeriod({ cartItem: item, newPeriod: +value });
    },
    [item, onUpdatePeriod],
  );

  return (
    <>
      <Badge
        show
        type={isEditable ? BADGE_TYPES.SIMPLE : BADGE_TYPES.WHITE}
        className={shouldShowPeriod && classes.itemWithPeriod}
      >
        <div className={classes.itemContainer}>
          <div className={classes.itemNameContainer}>
            <span className={classes.address}>
              {item.address
                ? `${address}${FIO_ADDRESS_DELIMITER}${domain}`
                : domain}
            </span>

            <span className={classes.descriptor}>
              {getCartItemDescriptor({
                type: item.type,
                period: item.period,
                hasCustomDomainInCart: item.hasCustomDomainInCart,
              })}
            </span>
          </div>
          {shouldShowPeriod && (
            <div className={classes.period}>
              <CustomDropdown
                value={period?.toString()}
                options={CART_ITEM_PERIOD_OPTIONS}
                onChange={onPeriodChange}
                isDark
              />
            </div>
          )}
          <div
            className={classnames(
              classes.price,
              onDelete && classes.deletePrice,
            )}
          >
            <CartItemPrice
              costFio={costFio}
              costUsdc={costUsdc}
              costNativeFio={costNativeFio}
              domainType={domainType}
              isFree={isFree}
            />
          </div>
          {onDelete && (
            <CancelIcon
              className={classes.icon}
              onClick={() => onDelete(item)}
            />
          )}
        </div>
      </Badge>
      {showBadge && (
        <Badge show type={BADGE_TYPES.INFO}>
          <div className={classes.infoBadge}>
            <InfoIcon className={classes.infoIcon} />
            <p className={classes.infoText}>
              <span className="boldText">FIO Handle Cost</span> - Your account
              already has a free FIO Handle associated with it.
            </p>
          </div>
        </Badge>
      )}
    </>
  );
};

export default CartItem;

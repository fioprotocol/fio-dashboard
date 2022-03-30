import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import Badge, { BADGE_TYPES } from '../Badge/Badge';

import { deleteCartItem, isFreeDomain, compose } from '../../utils';
import MathOp from '../../util/math';
import { convertFioPrices } from '../../util/prices';

import { addItem, deleteItem, recalculate } from '../../redux/cart/actions';

import { NotificationActionProps } from './types';
import { CartItem } from '../../types';

import classes from './AddressDomainForm.module.scss';

const NotificationActionBadge: React.FC<NotificationActionProps> = props => {
  const {
    showAvailable,
    hasErrors,
    isAddress,
    isDomain,
    isFree,
    hasCustomDomain,
    currentCartItem,
    domains,
    values,
    prices,
    cartItems,
    roe,
    addItem,
    deleteItem,
    recalculate,
  } = props;

  const { address, domain: domainName } = values || {};
  const {
    nativeFio: { address: natvieFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  const hasOnlyDomain =
    domainName &&
    cartItems.some(
      (item: CartItem) =>
        !item.address && item.domain === domainName.toLowerCase(),
    );

  let costNativeFio = 0;

  if (!isFree && isAddress) {
    costNativeFio = isAddress ? natvieFioAddressPrice : nativeFioDomainPrice;
  }
  if (hasCustomDomain) {
    costNativeFio = costNativeFio
      ? new MathOp(costNativeFio).add(nativeFioDomainPrice).toNumber()
      : nativeFioDomainPrice;
  }
  if (!isFree && currentCartItem?.costNativeFio) {
    costNativeFio = currentCartItem.costNativeFio;
  }

  const fioPrices = convertFioPrices(costNativeFio, roe);

  const costFio = fioPrices.fio;
  const costUsdc = fioPrices.usdc;

  const addItemToCart = () => {
    let id = '';
    if (address) {
      id = address + '@';
    }

    id += domainName;

    const newCartItem: CartItem = {
      ...values,
      id,
      allowFree: isFreeDomain({ domains, domain: domainName }),
    };

    if ((address && hasCustomDomain) || hasOnlyDomain)
      newCartItem.hasCustomDomain = true;
    if (costNativeFio && costNativeFio > 0)
      newCartItem.costNativeFio = costNativeFio;
    if (address && hasOnlyDomain) {
      newCartItem.costNativeFio = new MathOp(newCartItem.costNativeFio || 0)
        .add(nativeFioDomainPrice)
        .toNumber();
      const recalcFioPrices = convertFioPrices(newCartItem.costNativeFio, roe);
      newCartItem.costFio = recalcFioPrices.fio;
      newCartItem.costUsdc = recalcFioPrices.usdc;

      recalculate([
        ...cartItems.filter(
          (item: CartItem) => item.domain !== domainName.toLowerCase(),
        ),
        newCartItem,
      ]);
    } else {
      const addItemFioPrices = convertFioPrices(newCartItem.costNativeFio, roe);
      newCartItem.costFio = addItemFioPrices.fio;
      newCartItem.costUsdc = addItemFioPrices.usdc;
      addItem(newCartItem);
    }
  };
  return (
    <Badge type={BADGE_TYPES.SIMPLE} show={showAvailable}>
      <div
        className={classnames(
          classes.addressContainer,
          !hasErrors && classes.showPrice,
        )}
      >
        <p className={classes.address}>
          {isAddress && (
            <>
              <span className={classes.name}>{address}</span>@
            </>
          )}
          {isDomain ? (
            <span className={classes.name}>{domainName}</span>
          ) : (
            domainName
          )}
        </p>
        <p className={classes.price}>
          {isFree && !hasCustomDomain ? (
            'FREE'
          ) : (
            <>
              {costFio} FIO{' '}
              <span className={classes.usdcAmount}>({costUsdc} USDC)</span>
            </>
          )}
        </p>
        <div className={classes.actionContainer}>
          <Button
            className={classnames(
              classes.button,
              !currentCartItem && classes.show,
            )}
            onClick={addItemToCart}
          >
            <FontAwesomeIcon icon="plus-square" className={classes.icon} />
            Add to Cart
          </Button>
          <div
            className={classnames(
              classes.added,
              currentCartItem && classes.show,
            )}
          >
            <div className={classes.fioBadge}>
              <FontAwesomeIcon icon="check-circle" className={classes.icon} />
              <p className={classes.title}>Added</p>
            </div>
            <FontAwesomeIcon
              icon="times-circle"
              className={classes.iconClose}
              onClick={() => {
                deleteCartItem({
                  id: currentCartItem.id,
                  prices,
                  deleteItem,
                  cartItems,
                  recalculate,
                  roe,
                });
              }}
            />
          </div>
        </div>
      </div>
    </Badge>
  );
};

const reduxConnect = connect(null, {
  addItem,
  deleteItem,
  recalculate,
});

export default compose(reduxConnect)(NotificationActionBadge);

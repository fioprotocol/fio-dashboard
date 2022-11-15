import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import Badge, { BADGE_TYPES } from '../Badge/Badge';

import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
} from '../../constants/common';

import { isFreeDomain, compose, FIO_ADDRESS_DELIMITER } from '../../utils';
import MathOp from '../../util/math';
import { deleteCartItem, getCartItemDescriptor } from '../../util/cart';
import { convertFioPrices } from '../../util/prices';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';

import { addItem, deleteItem, setCartItems } from '../../redux/cart/actions';

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
    setCartItems,
    isLoading,
  } = props;

  const { address, domain: domainName } = values || {};
  const {
    nativeFio: { address: natvieFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  const hasOnlyDomain =
    domainName &&
    cartItems.some(
      (item: CartItem) =>
        item.type === CART_ITEM_TYPE.DOMAIN &&
        !item.address &&
        item.domain === domainName.toLowerCase(),
    );
  const itemType = !address
    ? CART_ITEM_TYPE.DOMAIN
    : (address && hasCustomDomain) || hasOnlyDomain
    ? CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
    : CART_ITEM_TYPE.ADDRESS;

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
      id = address + FIO_ADDRESS_DELIMITER;
    }

    id += domainName;

    const newCartItem: CartItem = {
      ...values,
      type: itemType,
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

      const newCartItems = [
        ...cartItems.filter(
          (item: CartItem) => item.domain !== domainName.toLowerCase(),
        ),
        newCartItem,
      ];
      setCartItems(newCartItems);
      fireAnalyticsEvent(
        ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
        getCartItemsDataForAnalytics(newCartItems),
      );
    } else {
      const addItemFioPrices = convertFioPrices(newCartItem.costNativeFio, roe);
      newCartItem.costFio = addItemFioPrices.fio;
      newCartItem.costUsdc = addItemFioPrices.usdc;
      addItem(newCartItem);
      fireAnalyticsEvent(
        ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
        getCartItemsDataForAnalytics([...cartItems, newCartItem]),
      );
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
          <span>
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
          </span>
          <span className={classes.descriptor}>
            {getCartItemDescriptor(itemType)}
          </span>
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
            variant={isLoading ? 'secondary' : 'primary'}
            disabled={isLoading}
            onClick={addItemToCart}
          >
            {isLoading ? (
              <div className={classes.bouncingLoader}>
                <div />
                <div />
                <div />
              </div>
            ) : (
              <>
                <FontAwesomeIcon icon="plus-square" className={classes.icon} />
                Add to Cart
              </>
            )}
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
                  setCartItems,
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
  setCartItems,
});

export default compose(reduxConnect)(NotificationActionBadge);

import MathOp from 'big.js';

import { CART_ITEM_TYPE } from '../config/constants';

import { fioApi } from '../external/fio.mjs';
import { DOMAIN_TYPE } from '../constants/cart.mjs';

export function convertFioPrices(nativeFio, roe) {
  const fioAmount = fioApi.sufToAmount(nativeFio || 0);

  return {
    nativeFio,
    fio: `${fioAmount != null ? fioAmount.toFixed(2) : fioAmount}`,
    usdc: `${
      nativeFio != null && roe != null ? fioApi.convertFioToUsdc(nativeFio, roe) : 0
    }`,
  };
}

export const handlePriceForMultiYearFioHandleWithCustomDomain = ({ prices, period }) => {
  const { address, domain, renewDomain } = prices;
  const renewDomainNativeCost = new MathOp(renewDomain).mul(period - 1).toNumber();

  return new MathOp(address)
    .add(domain)
    .add(renewDomainNativeCost)
    .toNumber();
};

export const handleFioHandleOnExistingCustomDomain = ({
  cartItems,
  newItem,
  prices,
  roe,
}) => {
  const { domain, period, type } = newItem;

  const existingCustomDomain =
    type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN &&
    cartItems.find(cartItem => cartItem.id === domain);

  if (existingCustomDomain) {
    if (existingCustomDomain.period > 1) {
      const nativeFioAmount = handlePriceForMultiYearFioHandleWithCustomDomain({
        prices,
        period,
      });
      const { fio, usdc } = convertFioPrices(nativeFioAmount, roe);
      newItem = {
        ...newItem,
        costNativeFio: nativeFioAmount,
        costFio: fio,
        costUsdc: usdc,
      };
    }

    return [
      ...cartItems.filter(cartItem => cartItem.id !== existingCustomDomain.id),
      newItem,
    ];
  }

  return [...cartItems, newItem];
};

export const cartHasFreeItemsOnDashboardDomains = ({ cartItems, dashboardDomains }) => {
  return (
    cartItems &&
    cartItems.some(cartItem => {
      const { allowFree, domain, isFree, domainType } = cartItem;
      const existingDashboardDomain = dashboardDomains.find(
        dashboardDomain => dashboardDomain.name === domain,
      );

      return (
        existingDashboardDomain &&
        !existingDashboardDomain.isPremium &&
        isFree &&
        allowFree &&
        domainType === DOMAIN_TYPE.FREE
      );
    })
  );
};

export const handleFreeCartAddItem = ({
  cartItems,
  dashboardDomains,
  freeDomainOwner,
  item,
  userHasFreeAddress,
}) => {
  const { domain, type } = item;

  if (type === CART_ITEM_TYPE.ADDRESS) {
    const existingDashboardDomain = dashboardDomains.find(
      dashboardDomain => dashboardDomain.name === domain,
    );
    if (
      (existingDashboardDomain &&
        !existingDashboardDomain.isPremium &&
        !userHasFreeAddress &&
        !cartHasFreeItemsOnDashboardDomains({ cartItems, dashboardDomains })) ||
      (!existingDashboardDomain && freeDomainOwner)
    ) {
      return { ...item, isFree: true };
    }
    return { ...item, isFree: false };
  }

  return item;
};

export const handleFreeCartDeleteItem = ({
  cartItems,
  dashboardDomains,
  existingItem,
  userHasFreeAddress,
}) => {
  const { id, domain, domainType, isFree, type } = existingItem;

  const deletedCartItems = cartItems.filter(cartItem => cartItem.id !== id);

  if (
    isFree &&
    type === CART_ITEM_TYPE.ADDRESS &&
    domainType === DOMAIN_TYPE.FREE &&
    !userHasFreeAddress
  ) {
    const allowedFreeItem = cartItems.find(cartItem => {
      const {
        domainType: cartItemDomainType,
        isFree: cartItemIsFree,
        type: cartItemType,
      } = cartItem;

      const existingDashboardDomain = dashboardDomains.find(
        dashboardDomain => dashboardDomain.name === domain,
      );

      return (
        !cartItemIsFree &&
        existingDashboardDomain &&
        existingDashboardDomain &&
        !existingDashboardDomain.isPremium &&
        cartItemDomainType === DOMAIN_TYPE.FREE &&
        cartItemType === CART_ITEM_TYPE.ADDRESS
      );
    });

    if (allowedFreeItem) {
      return deletedCartItems.map(cartItem =>
        cartItem.id === allowedFreeItem.id ? { ...cartItem, isFree: true } : cartItem,
      );
    }
  }

  return deletedCartItems;
};

import isEmpty from 'lodash/isEmpty';

import {
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
} from '../constants/common';
import { DOMAIN_TYPE } from '../constants/fio';
import { CART_ITEM_DESCRIPTOR } from '../constants/labels';

import MathOp from './math';
import { setFioName } from '../utils';
import { convertFioPrices } from './prices';
import { CartItem, CartItemType, NativePrices, OrderItem } from '../types';
import { DomainsArrItemType } from '../pages/FioAddressSelectionPage/types';

export const cartHasFreeItemsOnDomains = ({
  cartItems,
  domains,
}: {
  cartItems: CartItem[];
  domains: DomainsArrItemType;
}) => {
  return (
    cartItems &&
    cartItems.some(cartItem => {
      const { domain, isFree, domainType } = cartItem;
      const existingDomain = domains.find(
        domainItem => domainItem.name === domain,
      );

      return (
        existingDomain &&
        existingDomain.domainType !== DOMAIN_TYPE.PREMIUM &&
        isFree &&
        domainType === DOMAIN_TYPE.ALLOW_FREE
      );
    })
  );
};

export const cartHasFreeItem = (cartItems: CartItem[]): boolean => {
  return (
    !isEmpty(cartItems) &&
    cartItems.some(
      item =>
        item.domainType === DOMAIN_TYPE.ALLOW_FREE &&
        item.isFree &&
        !!item.address,
    )
  );
};

export const cartHasOnlyFreeItems = (cart: CartItem[]): boolean =>
  cart.length &&
  cart.every(
    item =>
      item.isFree &&
      item.type === CART_ITEM_TYPE.ADDRESS &&
      (item.domainType === DOMAIN_TYPE.ALLOW_FREE ||
        item.domainType === DOMAIN_TYPE.PRIVATE),
  );

export const totalCost = (
  cartItems: CartItem[],
  roe: number,
): {
  costNativeFio?: number;
  costFree?: string;
  costFio?: string;
  costUsdc?: string;
} => {
  if (cartItems.length > 0 && cartItems.every(cartItem => cartItem.isFree))
    return { costFree: 'FREE' };

  const fioNativeTotal = cartItems
    .filter(cartItem => !cartItem.isFree)
    .reduce<number>(
      (acc, cartItem) => new MathOp(acc).add(cartItem.costNativeFio).toNumber(),
      0,
    );

  const { fio, usdc } = convertFioPrices(fioNativeTotal, roe);

  return {
    costNativeFio: fioNativeTotal,
    costFio: fio,
    costUsdc: usdc,
  };
};

export const cartIsRelative = (
  cartItems: CartItem[],
  orderItems: OrderItem[],
): boolean => {
  const cartItemsLength = cartItems.reduce(
    (length, item) =>
      CART_ITEM_TYPES_WITH_PERIOD.includes(item.type) && item.period > 1
        ? !!item.address && item.domainType === DOMAIN_TYPE.CUSTOM
          ? length + Number(item.period) + 1
          : length + Number(item.period)
        : !!item.address &&
          item.domainType === DOMAIN_TYPE.CUSTOM &&
          !item.hasCustomDomainInCart
        ? length + 2
        : length + 1,
    0,
  );

  if (!new MathOp(cartItemsLength).eq(orderItems.length)) return false;

  for (const cartItem of cartItems) {
    if (
      !orderItems.find(
        ({ address, domain }) =>
          setFioName(address, domain) ===
          setFioName(cartItem.address, cartItem.domain),
      )
    )
      return false;
  }
  return true;
};

export const getCartItemDescriptor = ({
  hasCustomDomainInCart,
  type,
  period,
}: {
  hasCustomDomainInCart?: boolean;
  type: CartItemType;
  period?: number;
}): string => {
  let descriptor = CART_ITEM_DESCRIPTOR[type];
  if (
    CART_ITEM_TYPES_WITH_PERIOD.includes(type) &&
    period &&
    !hasCustomDomainInCart
  ) {
    descriptor = `${descriptor} - ${period} year${period > 1 ? 's' : ''}`;
  }
  return descriptor;
};

export const handlePriceForMultiYearItems = ({
  includeAddress,
  prices,
  period,
}: {
  includeAddress?: boolean;
  prices: NativePrices;
  period: number;
}): number => {
  const { address, domain, renewDomain } = prices;

  const renewPeriod = new MathOp(period).sub(1).toNumber();
  const renewDomainNativeCost = new MathOp(renewDomain)
    .mul(renewPeriod)
    .toNumber();
  const multiDomainPrice = new MathOp(domain)
    .add(renewDomainNativeCost)
    .toNumber();

  if (includeAddress) {
    return new MathOp(multiDomainPrice).add(address).toNumber();
  }

  return multiDomainPrice;
};

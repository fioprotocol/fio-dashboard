import { GenericAction } from '@fioprotocol/fiosdk';

import {
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
} from '../constants/common';
import { DOMAIN_TYPE } from '../constants/fio';
import { CART_ITEM_DESCRIPTOR } from '../constants/labels';

import MathOp from './math';
import { setFioName } from '../utils';
import { convertFioPrices } from './prices';
import {
  CartItem,
  CartItemType,
  FioDomainDoublet,
  FioWalletDoublet,
  NativePrices,
  OrderItem,
  Roe,
} from '../types';

export const cartHasOnlyFreeItems = (cart: CartItem[]): boolean =>
  cart.length &&
  cart.every(
    item =>
      item.isFree &&
      item.type === CART_ITEM_TYPE.ADDRESS &&
      (item.domainType === DOMAIN_TYPE.ALLOW_FREE ||
        item.domainType === DOMAIN_TYPE.PRIVATE),
  );

export type TotalCost = {
  costNativeFio?: string;
  costFree?: string;
  costFio?: string;
  costUsdc?: string;
};

export const totalCost = (cartItems: CartItem[], roe: Roe): TotalCost => {
  if (cartItems.length > 0 && cartItems.every(cartItem => cartItem.isFree))
    return { costFree: 'FREE' };

  const fioNativeTotal = cartItems
    .filter(cartItem => !cartItem.isFree)
    .reduce<string>(
      (acc, cartItem) => new MathOp(acc).add(cartItem.costNativeFio).toString(),
      '0',
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
      length +
      1 +
      (CART_ITEM_TYPES_WITH_PERIOD.includes(item.type) &&
      !item.hasCustomDomainInCart
        ? Number(item.period) - 1
        : 0),
    0,
  );

  const orderItemsLength = orderItems.reduce(
    (length, item) =>
      length +
      (item.action === GenericAction.registerFioDomain &&
      !!orderItems.find(
        it =>
          it.action === GenericAction.registerFioAddress &&
          it.domain === item.domain,
      )
        ? 0
        : 1),
    0,
  );

  if (!new MathOp(cartItemsLength).eq(orderItemsLength)) return false;

  for (const cartItem of cartItems) {
    if (
      !orderItems.find(
        ({ address, domain }) =>
          setFioName(address, domain) ===
          setFioName(cartItem.address, cartItem.domain),
      )
    ) {
      return false;
    }
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
}): string => {
  const { domain, renewDomain, combo } = prices;
  const renewPeriod = new MathOp(period).sub(1).toNumber();
  const renewDomainNativeCost = new MathOp(renewDomain)
    .mul(renewPeriod)
    .toString();
  const multiDomainPrice = new MathOp(domain)
    .add(renewDomainNativeCost)
    .toString();

  if (includeAddress) {
    if (renewPeriod > 0) {
      return new MathOp(combo).add(renewDomainNativeCost).toString();
    } else {
      return combo;
    }
  }

  return multiDomainPrice;
};

export const actionFromCartItem = (
  cartItemType: string,
  isComboSupport: boolean,
) =>
  cartItemType === CART_ITEM_TYPE.DOMAIN_RENEWAL
    ? GenericAction.renewFioDomain
    : cartItemType === CART_ITEM_TYPE.ADD_BUNDLES
    ? GenericAction.addBundledTransactions
    : cartItemType === CART_ITEM_TYPE.DOMAIN
    ? GenericAction.registerFioDomain
    : isComboSupport
    ? GenericAction.registerFioDomainAddress
    : GenericAction.registerFioAddress;

export type GroupedCartItem = {
  type?: string;
  domain?: string;
};

export type GroupedCartItemsByPaymentWallet<T extends GroupedCartItem> = {
  signInFioWallet: FioWalletDoublet;
  displayOrderItems: T[];
};

export type GroupCartItemsByPaymentWalletResult<T extends GroupedCartItem> = {
  groups: GroupedCartItemsByPaymentWallet<T>[];
  hasPublicCartItems: boolean;
};

export const groupCartItemsByPaymentWallet = <T extends GroupedCartItem>(
  defaultWalletPublicKey: string,
  displayOrderItems: T[],
  fioWallets: FioWalletDoublet[],
  userDomains: FioDomainDoublet[],
): GroupCartItemsByPaymentWalletResult<T> => {
  const defaultOwnerWallet = fioWallets.find(
    wallet => wallet.publicKey === defaultWalletPublicKey,
  );

  if (!defaultOwnerWallet) {
    return { groups: [], hasPublicCartItems: false };
  }

  let hasPublicCartItems = false;
  const groups: GroupedCartItemsByPaymentWallet<T>[] = [];

  const addToGroup = (signInFioWallet: FioWalletDoublet, cartItem: T) => {
    let group = groups.find(
      it => it.signInFioWallet.publicKey === signInFioWallet.publicKey,
    );

    if (!group) {
      group = {
        signInFioWallet,
        displayOrderItems: [],
      };
      groups.push(group);
    }

    group.displayOrderItems.push(cartItem);
  };

  for (const displayOrderItem of displayOrderItems) {
    if (displayOrderItem.type !== CART_ITEM_TYPE.ADDRESS) {
      hasPublicCartItems = true;
      addToGroup(defaultOwnerWallet, displayOrderItem);
      continue;
    }

    const addressDomain = userDomains.find(
      domain => domain.name === displayOrderItem.domain,
    );

    if (!addressDomain || addressDomain.isPublic) {
      hasPublicCartItems = true;
      addToGroup(defaultOwnerWallet, displayOrderItem);
      continue;
    }

    const domainOwnerWallet = fioWallets.find(
      wallet => wallet.publicKey === addressDomain.walletPublicKey,
    );

    addToGroup(domainOwnerWallet, displayOrderItem);
  }

  return { groups, hasPublicCartItems };
};

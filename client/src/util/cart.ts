import {
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
} from '../constants/common';
import { ACTIONS, DOMAIN_TYPE } from '../constants/fio';
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
  costNativeFio?: number;
  costFree?: string;
  costFio?: string;
  costUsdc?: string;
};

export const totalCost = (cartItems: CartItem[], roe: number): TotalCost => {
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
      (item.action === ACTIONS.registerFioDomain &&
      !!orderItems.find(
        it =>
          it.action === ACTIONS.registerFioAddress && it.domain === item.domain,
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
}): number => {
  const { domain, renewDomain, combo } = prices;
  const renewPeriod = new MathOp(period).sub(1).toNumber();
  const renewDomainNativeCost = new MathOp(renewDomain)
    .mul(renewPeriod)
    .toNumber();
  const multiDomainPrice = new MathOp(domain)
    .add(renewDomainNativeCost)
    .toNumber();

  if (includeAddress) {
    if (renewPeriod > 0) {
      return new MathOp(combo).add(renewDomainNativeCost).toNumber();
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
    ? ACTIONS.renewFioDomain
    : cartItemType === CART_ITEM_TYPE.ADD_BUNDLES
    ? ACTIONS.addBundledTransactions
    : cartItemType === CART_ITEM_TYPE.DOMAIN
    ? ACTIONS.registerFioDomain
    : isComboSupport
    ? ACTIONS.registerFioDomainAddress
    : ACTIONS.registerFioAddress;

export type GroupedCartItemsByPaymentWallet = {
  signInFioWallet: FioWalletDoublet;
  cartItems: CartItem[];
};

export const groupCartItemsByPaymentWallet = (
  fioWallet: FioWalletDoublet,
  cartItems: CartItem[],
  fioWallets: FioWalletDoublet[],
  userDomains: FioDomainDoublet[],
): GroupedCartItemsByPaymentWallet[] => {
  const result: GroupedCartItemsByPaymentWallet[] = [];

  const addToGroup = (
    signInFioWallet: FioWalletDoublet,
    cartItem: CartItem,
  ) => {
    let group = result.find(
      it => it.signInFioWallet.publicKey === signInFioWallet.publicKey,
    );

    if (!group) {
      group = {
        signInFioWallet,
        cartItems: [],
      };
      result.push(group);
    }

    group.cartItems.push(cartItem);
  };

  for (const cartItem of cartItems) {
    if (cartItem.type !== CART_ITEM_TYPE.ADDRESS) {
      addToGroup(fioWallet, cartItem);
      continue;
    }

    const addressDomain = userDomains.find(
      domain => domain.name === cartItem.domain,
    );

    if (!!addressDomain || addressDomain.isPublic) {
      addToGroup(fioWallet, cartItem);
      continue;
    }

    const domainOwnerWallet = fioWallets.find(
      wallet => wallet.publicKey === addressDomain.walletPublicKey,
    );

    addToGroup(domainOwnerWallet, cartItem);
  }

  return result;
};

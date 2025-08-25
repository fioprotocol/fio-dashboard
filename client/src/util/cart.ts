import { GenericAction } from '@fioprotocol/fiosdk';

import {
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
  CURRENCY_CODES,
  WALLET_CREATED_FROM,
} from '../constants/common';
import { DOMAIN_TYPE } from '../constants/fio';
import { CART_ITEM_DESCRIPTOR } from '../constants/labels';
import { BC_TX_STATUSES } from '../constants/purchase';

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
import { checkIsDomainExpired, checkIsTooLongDomainRenewal } from './fio';

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
  costNativeFio: string;
  costFree?: string;
  costFio: string;
  costUsdc: string;
};

export const totalCost = (cartItems: CartItem[], roe: Roe): TotalCost => {
  if (cartItems.length > 0 && cartItems.every(cartItem => cartItem.isFree))
    return {
      costFree: 'FREE',
      costNativeFio: '0',
      costFio: '0',
      costUsdc: '0',
    };

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
  registerOnlyAddress,
  prices,
  period,
}: {
  includeAddress?: boolean;
  registerOnlyAddress?: boolean;
  prices: NativePrices;
  period: number;
}): string => {
  const { address, domain, renewDomain, combo } = prices;

  if (registerOnlyAddress) {
    return address;
  }

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

export const walletSupportsCombo = (wallet: FioWalletDoublet) =>
  wallet.from !== WALLET_CREATED_FROM.LEDGER;

export const cartItemsToOrderItems = ({
  cartItems,
  prices,
  supportCombo,
  roe,
}: {
  cartItems: CartItem[];
  prices: NativePrices;
  supportCombo: boolean;
  roe: Roe;
}) => {
  const orderItems: OrderItem[] = [];

  for (const cartItem of cartItems) {
    const {
      address,
      domain,
      id,
      isFree,
      hasCustomDomainInCart,
      period,
      type,
    } = cartItem;

    const orderItem: OrderItem = {
      id: '',
      action: '',
      createdAt: '',
      nativeFio: '',
      price: '',
      priceCurrency: CURRENCY_CODES.USDC,
      data: {
        cartItemId: id,
        type,
      },
      domain,
      updatedAt: '',
      blockchainTransactions: [],
      orderItemStatus: {
        txStatus: BC_TX_STATUSES.NONE,
      },
    };

    const renewOrderItem: OrderItem = {
      ...orderItem,
      action: GenericAction.renewFioDomain,
      address: null,
      nativeFio: prices.renewDomain,
      price: convertFioPrices(prices.renewDomain, roe).usdc,
    };

    const domainOrderItem: OrderItem = {
      ...orderItem,
      address: null,
      action: GenericAction.registerFioDomain,
      nativeFio: prices.domain,
      price: convertFioPrices(prices.domain, roe).usdc,
    };

    switch (type) {
      case CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN: {
        const useComboAction = !hasCustomDomainInCart && supportCombo;

        if (!supportCombo && !hasCustomDomainInCart) {
          orderItems.push({
            ...domainOrderItem,
            data: { ...domainOrderItem.data, cartItemId: domain },
          });
          renewOrderItem.data = { ...renewOrderItem.data, cartItemId: domain };
        }

        orderItem.action = useComboAction
          ? GenericAction.registerFioDomainAddress
          : GenericAction.registerFioAddress;
        orderItem.address = address;
        orderItem.nativeFio = (useComboAction
          ? prices.combo
          : prices.address
        ).toString();
        orderItem.price = convertFioPrices(
          useComboAction ? prices.combo : prices.address,
          roe,
        ).usdc;
        orderItems.push(orderItem);

        if (!hasCustomDomainInCart) {
          for (let i = 1; i < Number(period); i++) {
            orderItems.push(renewOrderItem);
          }
        }
        break;
      }
      case CART_ITEM_TYPE.DOMAIN_RENEWAL: {
        for (let i = 0; i < Number(period); i++) {
          orderItems.push(renewOrderItem);
        }
        break;
      }
      case CART_ITEM_TYPE.ADD_BUNDLES:
        orderItem.action = GenericAction.addBundledTransactions;
        orderItem.address = address;
        orderItem.nativeFio = prices.addBundles;
        orderItem.price = convertFioPrices(prices.addBundles, roe).usdc;
        orderItems.push(orderItem);
        break;
      case CART_ITEM_TYPE.ADDRESS: {
        orderItem.action = GenericAction.registerFioAddress;
        orderItem.address = address;
        orderItem.nativeFio = isFree ? '0' : prices.address;
        orderItem.price = isFree
          ? '0'
          : convertFioPrices(prices.address, roe).usdc;
        orderItems.push(orderItem);
        break;
      }
      case CART_ITEM_TYPE.DOMAIN: {
        orderItems.push(domainOrderItem);

        for (let i = 1; i < Number(period); i++) {
          orderItems.push(renewOrderItem);
        }
        break;
      }
      default:
        break;
    }
  }

  return orderItems;
};

export const handleDomainsExpiration = async ({
  cartItems,
}: {
  cartItems: CartItem[];
}): Promise<{
  hasExpiredDomain: boolean;
  hasTooLongDomainRenewal: boolean;
}> => {
  let hasExpiredDomain = false;
  let hasTooLongDomainRenewal = false;

  const domainsWithoutPeriod = cartItems
    .filter(
      ({ domain, type }) =>
        domain && !CART_ITEM_TYPES_WITH_PERIOD.includes(type),
    )
    .map(({ domain }) => domain);

  const domainsWithMultiYearPeriod = cartItems
    .filter(
      ({ domain, type }) =>
        domain && CART_ITEM_TYPES_WITH_PERIOD.includes(type),
    )
    .reduce((acc, { domain, period }) => {
      acc[domain] = (acc[domain] || 0) + (period || 0);
      return acc;
    }, {} as { [key: string]: number });

  const uniqueDomains = [...new Set(domainsWithoutPeriod)];

  for (const domain of uniqueDomains) {
    const isExpired = await checkIsDomainExpired(domain);
    if (isExpired) {
      hasExpiredDomain = isExpired;
      break;
    }
  }

  for (const domainItem of Object.entries(domainsWithMultiYearPeriod)) {
    const [domain, period] = domainItem;
    const domainHasTooLongRenewalPeriod = await checkIsTooLongDomainRenewal({
      domainName: domain,
      period,
    });
    if (domainHasTooLongRenewalPeriod) {
      hasTooLongDomainRenewal = domainHasTooLongRenewalPeriod;
      break;
    }
  }

  return { hasExpiredDomain, hasTooLongDomainRenewal };
};

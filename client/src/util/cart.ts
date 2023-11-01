import isEmpty from 'lodash/isEmpty';

import { store } from '../redux/init';

import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
} from '../constants/common';
import { DOMAIN_TYPE } from '../constants/fio';
import { CART_ITEM_DESCRIPTOR } from '../constants/labels';

import { setCartItems } from '../redux/cart/actions';

import { handlePriceForMultiYearFchWithCustomDomain } from './fio';
import MathOp from './math';
import { setFioName } from '../utils';
import { convertFioPrices } from './prices';
import { fireAnalyticsEvent, getCartItemsDataForAnalytics } from './analytics';

import {
  CartItem,
  CartItemType,
  DeleteCartItem,
  NativePrices,
  OrderItem,
  Prices,
} from '../types';

export const setFreeCart = ({
  cartItems,
}: {
  cartItems: CartItem[];
}): CartItem[] => {
  const recalcElem = cartItems.find(
    item =>
      item.address &&
      item.domain &&
      item.allowFree &&
      item.domainType !== DOMAIN_TYPE.PRIVATE,
  );
  if (recalcElem) {
    recalcElem.domainType = DOMAIN_TYPE.FREE;

    return cartItems.map(item => {
      delete item.showBadge;
      return item.id === recalcElem.id ? recalcElem : item;
    });
  } else {
    return cartItems;
  }
};

export const recalculateCart = ({
  cartItems,
  id,
}: {
  cartItems: CartItem[];
  id: string;
}): { id: string; cartItems?: CartItem[]; deletedCartItem?: CartItem } => {
  const deletedElement = cartItems.find(item => item.id === id);
  if (!deletedElement) return;

  const data: {
    id: string;
    cartItems?: CartItem[];
    deletedCartItem?: CartItem;
  } = {
    id,
    deletedCartItem: deletedElement,
  };

  const deletedElemCart = cartItems.filter(item => item.id !== id);

  if (!deletedElement.costNativeFio) {
    data.cartItems = setFreeCart({ cartItems: deletedElemCart });
  }

  return data;
};

export const removeFreeCart = ({
  cartItems,
  prices,
  roe,
}: {
  cartItems: CartItem[];
  prices: Prices;
  roe: number;
}): CartItem[] => {
  const {
    nativeFio: { address: nativeFioAddressPrice },
  } = prices;

  return cartItems.map(item => {
    if (
      (!item.costNativeFio || item.domainType === DOMAIN_TYPE.FREE) &&
      item.domainType !== DOMAIN_TYPE.PRIVATE
    ) {
      item.costNativeFio = nativeFioAddressPrice;
      item.showBadge = true;
      item.domainType = DOMAIN_TYPE.PREMIUM;
    }

    const fioPrices = convertFioPrices(
      item.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN && item.period > 1
        ? handlePriceForMultiYearFchWithCustomDomain({
            costNativeFio: item.costNativeFio,
            nativeFioAddressPrice: item.nativeFioAddressPrice,
            period: item.period,
          })
        : new MathOp(item.costNativeFio).mul(item.period || 1).toNumber() || 0,
      roe,
    );
    item.costFio = fioPrices.fio;
    item.costUsdc = fioPrices.usdc;

    return item;
  });
};

export const cartHasFreeItem = (cartItems: CartItem[]): boolean => {
  return (
    !isEmpty(cartItems) &&
    cartItems.some(
      item =>
        (!item.costNativeFio || item.domainType === DOMAIN_TYPE.FREE) &&
        !!item.address &&
        item.domainType !== DOMAIN_TYPE.PRIVATE,
    )
  );
};

export const handleFreeAddressCart = ({
  setCartItems,
  cartItems,
  prices,
  hasFreeAddress,
  roe,
}: {
  setCartItems: (cartItems: CartItem[]) => void;
  cartItems: CartItem[];
  prices: Prices;
  hasFreeAddress: boolean;
  roe: number;
}): void => {
  let retCart: CartItem[] = [];
  if (hasFreeAddress) {
    retCart = removeFreeCart({ cartItems, prices, roe });
  } else if (!cartHasFreeItem(cartItems)) {
    retCart = setFreeCart({ cartItems });
  }
  setCartItems(!isEmpty(retCart) ? retCart : cartItems);
};

// todo: remove after analytic move
export const addCartItem = (selectedItem: CartItem) => {
  const currentStore = store.getState();

  const cartItems: CartItem[] = currentStore.cart.cartItems;
  const roe = currentStore.registrations.roe;

  let newItem = { ...selectedItem };
  const {
    id,
    costNativeFio,
    domain,
    domainType,
    nativeFioAddressPrice,
    period,
    type,
  } = newItem;

  if (type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN && period > 1) {
    const nativeFioAmount = handlePriceForMultiYearFchWithCustomDomain({
      costNativeFio,
      nativeFioAddressPrice,
      period,
    });
    const { fio, usdc } = convertFioPrices(nativeFioAmount, roe);
    newItem = {
      ...newItem,
      costFio: fio,
      costUsdc: usdc,
    };
  }

  const newCartItems = [
    ...cartItems.filter((item: CartItem) => {
      if (domainType === DOMAIN_TYPE.CUSTOM && item.id === domain) return false; // remove domain item if we add custom fch with the same domain
      return item.id !== id;
    }),
    newItem,
  ];

  store.dispatch(setCartItems(newCartItems));

  fireAnalyticsEvent(
    ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
    getCartItemsDataForAnalytics([newItem]),
  );
};

// todo: remove after handle analytics
export const deleteCartItem = ({
  id,
  prices,
  deleteItem,
  cartItems,
  setCartItems,
  roe,
}: {
  id?: string;
  prices?: Prices;
  deleteItem?: (data: DeleteCartItem) => void;
  cartItems?: CartItem[];
  setCartItems?: (cartItems: CartItem[]) => void;
  roe?: number;
} = {}): void => {
  const data = recalculateCart({ cartItems, id }) || { id };
  deleteItem(data);
  if (data.deletedCartItem) {
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.REMOVE_ITEM_FROM_CART,
      getCartItemsDataForAnalytics([data.deletedCartItem]),
    );
  }

  const { address, domain, domainType, period } =
    cartItems.find(item => item.id === id) || {};
  const updCart = cartItems.filter(item => item.id !== id);

  if (!!address && domainType === DOMAIN_TYPE.CUSTOM) {
    const hasCurrentDomain =
      domain && updCart.some(item => item.domain === domain.toLowerCase());
    if (hasCurrentDomain) {
      const firstMatchElem =
        domain && updCart.find(item => item.domain === domain.toLowerCase());
      if (!isEmpty(firstMatchElem)) {
        const {
          nativeFio: {
            address: nativeFioAddressPrice,
            domain: nativeFioDomainPrice,
          },
        } = prices || { nativeFio: {} };

        const retObj = {
          ...firstMatchElem,
          costNativeFio: new MathOp(nativeFioDomainPrice)
            .add(nativeFioAddressPrice)
            .toNumber(),
          hasCustomDomain: true,
          domainType: DOMAIN_TYPE.CUSTOM,
          type: CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN,
          period,
        };
        const fioPrices = convertFioPrices(
          handlePriceForMultiYearFchWithCustomDomain({
            costNativeFio: retObj.costNativeFio,
            nativeFioAddressPrice,
            period,
          }),
          roe,
        );

        retObj.costFio = fioPrices.fio;
        retObj.costUsdc = fioPrices.usdc;

        const retData = updCart.map(item =>
          item.id === firstMatchElem.id ? retObj : item,
        );

        setCartItems(retData);
      }
    }
  }
};

// todo: remove after handle analytics
export const updateCartItemPeriod = ({
  id,
  period,
  cartItems,
  setCartItems,
  roe,
}: {
  id?: string;
  period?: number;
  cartItems?: CartItem[];
  setCartItems?: (cartItems: CartItem[]) => void;
  roe?: number;
} = {}): void => {
  const updatedCartItem = cartItems.map(item => {
    const newItem = {
      ...item,
    };
    const isMultipleYearCustomDomain =
      period > 1 && newItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;
    if (
      newItem.id === id &&
      CART_ITEM_TYPES_WITH_PERIOD.includes(newItem.type) &&
      newItem.period !== period
    ) {
      const periodDiff = Math.abs(period - newItem.period);
      fireAnalyticsEvent(
        newItem.period < period
          ? ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART
          : ANALYTICS_EVENT_ACTIONS.REMOVE_ITEM_FROM_CART,
        getCartItemsDataForAnalytics([
          {
            ...item,
            type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
            period: periodDiff,
            costUsdc: convertFioPrices(
              isMultipleYearCustomDomain
                ? new MathOp(newItem.costNativeFio)
                    .sub(newItem.nativeFioAddressPrice)
                    .mul(newItem.costNativeFio)
                    .toNumber()
                : new MathOp(newItem.costNativeFio).mul(periodDiff).toNumber(),
              roe,
            ).usdc,
          },
        ]),
      );

      const fioPrices =
        period > 1 && newItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
          ? convertFioPrices(
              handlePriceForMultiYearFchWithCustomDomain({
                costNativeFio: newItem.costNativeFio,
                nativeFioAddressPrice: newItem.nativeFioAddressPrice,
                period,
              }),
              roe,
            )
          : convertFioPrices(
              new MathOp(newItem.costNativeFio).mul(period).toNumber(),
              roe,
            );
      newItem.costFio = fioPrices.fio;
      newItem.costUsdc = fioPrices.usdc;
      newItem.period = period;
    }

    return newItem;
  });
  setCartItems(updatedCartItem);
};

export const cartHasOnlyFreeItems = (cart: CartItem[]): boolean =>
  cart.length &&
  !cart.some(
    item =>
      item.domainType === DOMAIN_TYPE.CUSTOM ||
      item.domainType === DOMAIN_TYPE.USERS ||
      item.domainType === DOMAIN_TYPE.PREMIUM ||
      item.type === CART_ITEM_TYPE.ADD_BUNDLES ||
      item.type === CART_ITEM_TYPE.DOMAIN_RENEWAL,
  );

export const totalCost = (
  cart: CartItem[],
  roe: number,
): {
  costNativeFio?: number;
  costFree?: string;
  costFio?: string;
  costUsdc?: string;
} => {
  if (
    (cart.length === 1 &&
      cart.some(
        item =>
          (!item.costNativeFio || item.domainType === DOMAIN_TYPE.FREE) &&
          !!item.address,
      )) ||
    cartHasOnlyFreeItems(cart)
  )
    return { costFree: 'FREE' };

  const cost = isEmpty(cart)
    ? { costNativeFio: 0 }
    : cart
        .filter(item => item.costNativeFio)
        .reduce<Record<string, number>>((acc, item) => {
          if (!acc.costNativeFio) acc.costNativeFio = 0;
          const nativeFio =
            item.domainType === DOMAIN_TYPE.FREE
              ? 0
              : item.period > 1 &&
                item.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
              ? handlePriceForMultiYearFchWithCustomDomain({
                  costNativeFio: item.costNativeFio || 0,
                  nativeFioAddressPrice: item.nativeFioAddressPrice,
                  period: item.period || 1,
                })
              : new MathOp(item.costNativeFio || 0)
                  .mul(item.period || 1)
                  .toNumber();
          return {
            costNativeFio: new MathOp(acc.costNativeFio)
              .add(nativeFio)
              .toNumber(),
          };
        }, {});

  const fioPrices = convertFioPrices(cost.costNativeFio, roe);

  return {
    costNativeFio: cost.costNativeFio || 0,
    costFio: fioPrices.fio || '0',
    costUsdc: fioPrices.usdc || '0',
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
          ? length + item.period + 1
          : length + item.period
        : !!item.address && item.domainType === DOMAIN_TYPE.CUSTOM
        ? length + 2
        : length + 1,
    0,
  );
  if (cartItemsLength !== orderItems.length) return false;

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

export const getCartItemDescriptor = (
  type: CartItemType,
  period?: number,
): string => {
  let descriptor = CART_ITEM_DESCRIPTOR[type];
  if (CART_ITEM_TYPES_WITH_PERIOD.includes(type) && period) {
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

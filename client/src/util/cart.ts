import isEmpty from 'lodash/isEmpty';

import { store } from '../redux/init';

import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
  CURRENCY_CODES,
} from '../constants/common';
import { ACTIONS, DOMAIN_TYPE } from '../constants/fio';
import { CART_ITEM_DESCRIPTOR } from '../constants/labels';

import { setCartItems } from '../redux/cart/actions';

import MathOp from './math';
import { setFioName } from '../utils';
import { convertFioPrices } from './prices';
import { fireAnalyticsEvent, getCartItemsDataForAnalytics } from './analytics';

import {
  CartItem,
  CartItemType,
  DeleteCartItem,
  OrderItem,
  Prices,
} from '../types';

export const setFreeCart = ({
  cartItems,
}: {
  cartItems: CartItem[];
}): CartItem[] => {
  const recalcElem = cartItems.find(
    item => item.address && item.domain && item.allowFree,
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
    if (!item.costNativeFio || item.domainType === DOMAIN_TYPE.FREE) {
      item.costNativeFio = nativeFioAddressPrice;
      item.showBadge = true;
    }

    const fioPrices = convertFioPrices(
      new MathOp(item.costNativeFio).mul(item.period || 1).toNumber() || 0,
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
        !!item.address,
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

export const addCartItem = (selectedItem: CartItem) => {
  const { domain } = selectedItem || {};

  const currentStore = store.getState();

  const cartItems: CartItem[] = currentStore.cart.cartItems;

  const newCartItems = [
    ...cartItems.filter(
      (item: CartItem) => item.domain !== domain.toLowerCase(),
    ),
    selectedItem,
  ];

  store.dispatch(setCartItems(newCartItems));

  fireAnalyticsEvent(
    ANALYTICS_EVENT_ACTIONS.ADD_ITEM_TO_CART,
    getCartItemsDataForAnalytics([selectedItem]),
  );
};

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

  const { domain, domainType } = cartItems.find(item => item.id === id) || {};
  const updCart = cartItems.filter(item => item.id !== id);

  if (domainType === DOMAIN_TYPE.CUSTOM) {
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
          costNativeFio: new MathOp(nativeFioAddressPrice)
            .add(nativeFioDomainPrice)
            .toNumber(),
          hasCustomDomain: true,
        };
        const fioPrices = convertFioPrices(retObj.costNativeFio, roe);

        retObj.costFio = fioPrices.fio;
        retObj.costUsdc = fioPrices.usdc;
        delete retObj.period;

        const retData = updCart.map(item =>
          item.id === firstMatchElem.id ? retObj : item,
        );

        setCartItems(retData);
      }
    }
  }
};

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
              new MathOp(newItem.costNativeFio).mul(periodDiff).toNumber(),
              roe,
            ).usdc,
          },
        ]),
      );

      const fioPrices = convertFioPrices(
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

export const getActionByCartItem = (
  type: CartItemType,
  address: string,
): string => {
  if (type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
    return ACTIONS.renewFioDomain;
  } else if (type === CART_ITEM_TYPE.ADD_BUNDLES) {
    return ACTIONS.addBundledTransactions;
  } else if (address) {
    return ACTIONS.registerFioAddress;
  } else {
    return ACTIONS.registerFioDomain;
  }
};

export const cartItemsToOrderItems = (
  cartItems: CartItem[],
  prices: Prices,
  roe: number,
) => {
  return cartItems
    .map(({ id, type, address, domain, costNativeFio, domainType, period }) => {
      const data: {
        hasCustomDomain?: boolean;
        hasCustomDomainFee?: number;
        cartItemId: string;
        period?: number;
      } = {
        cartItemId: id,
      };
      const nativeFio = domainType === DOMAIN_TYPE.FREE ? 0 : costNativeFio;

      if (domainType === DOMAIN_TYPE.CUSTOM) {
        data.hasCustomDomain = true;
        data.hasCustomDomainFee = new MathOp(costNativeFio)
          .sub(prices.nativeFio.address)
          .toNumber();
      }

      const item = {
        action: getActionByCartItem(type, address),
        address,
        domain,
        nativeFio: `${nativeFio || 0}`,
        price: convertFioPrices(nativeFio || 0, roe).usdc,
        priceCurrency: CURRENCY_CODES.USDC,
        data,
      };
      if (CART_ITEM_TYPES_WITH_PERIOD.includes(type) && period > 1) {
        const items = [item];
        const nativeFio = prices.nativeFio.renewDomain || costNativeFio;
        for (let i = 1; i < period; i++) {
          items.push({
            action: ACTIONS.renewFioDomain,
            address,
            domain,
            nativeFio: `${nativeFio || 0}`,
            price: convertFioPrices(nativeFio || 0, roe).usdc,
            priceCurrency: CURRENCY_CODES.USDC,
            data,
          });
        }
        return items;
      }

      return item;
    })
    .flat();
};

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
    cart.length === 1 &&
    cart.some(
      item =>
        (!item.costNativeFio || item.domainType === DOMAIN_TYPE.FREE) &&
        !!item.address,
    )
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
        ? length + item.period
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

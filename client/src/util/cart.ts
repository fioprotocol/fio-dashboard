import isEmpty from 'lodash/isEmpty';

import { ANALYTICS_EVENT_ACTIONS, CURRENCY_CODES } from '../constants/common';
import { ACTIONS } from '../constants/fio';

import MathOp from './math';
import { setFioName } from '../utils';
import { convertFioPrices } from './prices';
import { fireAnalyticsEvent, getCartItemsDataForAnalytics } from './analytics';

import { CartItem, DeleteCartItem, OrderItem, Prices } from '../types';

export const setFreeCart = ({
  cartItems,
}: {
  cartItems: CartItem[];
}): CartItem[] => {
  const recalcElem = cartItems.find(
    item => item.address && item.domain && item.allowFree,
  );
  if (recalcElem) {
    delete recalcElem.costNativeFio;
    recalcElem.costFio = '0.00';
    recalcElem.costUsdc = '0';

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
    if (!item.costNativeFio) {
      item.costNativeFio = nativeFioAddressPrice;
      item.showBadge = true;
    }

    const fioPrices = convertFioPrices(item.costNativeFio || 0, roe);
    item.costFio = fioPrices.fio;
    item.costUsdc = fioPrices.usdc;

    return item;
  });
};

export const cartHasFreeItem = (cartItems: CartItem[]): boolean => {
  return (
    !isEmpty(cartItems) &&
    cartItems.some(item => !item.costNativeFio && !!item.address)
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

  const { domain, hasCustomDomain } =
    cartItems.find(item => item.id === id) || {};
  const updCart = cartItems.filter(item => item.id !== id);

  if (hasCustomDomain) {
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

        const retData = updCart.map(item =>
          item.id === firstMatchElem.id ? retObj : item,
        );

        setCartItems(retData);
      }
    }
  }
};

export const cartItemsToOrderItems = (
  cartItems: CartItem[],
  prices: Prices,
  roe: number,
) => {
  return cartItems.map(
    ({ address, domain, costNativeFio, costUsdc, hasCustomDomain }) => {
      const data: {
        hasCustomDomain?: boolean;
        hasCustomDomainFee?: number;
      } = {};

      if (hasCustomDomain) {
        data.hasCustomDomain = hasCustomDomain;
        data.hasCustomDomainFee = new MathOp(costNativeFio)
          .sub(prices.nativeFio.address)
          .toNumber();
      }

      return {
        action: address
          ? ACTIONS.registerFioAddress
          : ACTIONS.registerFioDomain,
        address,
        domain,
        nativeFio: `${costNativeFio || 0}`,
        price: convertFioPrices(costNativeFio || 0, roe).usdc,
        priceCurrency: CURRENCY_CODES.USDC,
        data,
      };
    },
  );
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
    cart.some(item => !item.costNativeFio && !!item.address)
  )
    return { costFree: 'FREE' };

  const cost = isEmpty(cart)
    ? { costNativeFio: 0 }
    : cart
        .filter(item => item.costNativeFio)
        .reduce<Record<string, number>>((acc, item) => {
          if (!acc.costNativeFio) acc.costNativeFio = 0;
          return {
            costNativeFio: new MathOp(acc.costNativeFio)
              .add(item.costNativeFio || 0)
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
  if (cartItems.length !== orderItems.length) return false;

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

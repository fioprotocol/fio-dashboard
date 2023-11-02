import MathOp from 'big.js';

import { CART_ITEM_TYPE, FIO_ACTIONS, ORDER_ERROR_TYPES } from '../config/constants';

import { fioApi } from '../external/fio.mjs';
import { DOMAIN_TYPE } from '../constants/cart.mjs';
import { CURRENCY_CODES } from '../constants/fio.mjs';

const ALREADY_REGISTERED_ERROR_TEXT = 'already registered';

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

export const handlePriceForMultiYearItems = ({ includeAddress, prices, period }) => {
  const { address, domain, renewDomain } = prices;

  const renewPeriod = new MathOp(period).sub(1).toNumber();
  const renewDomainNativeCost = new MathOp(renewDomain).mul(renewPeriod).toNumber();
  const multiDomainPrice = new MathOp(domain).add(renewDomainNativeCost).toNumber();

  if (includeAddress) {
    return new MathOp(multiDomainPrice).add(address).toNumber();
  }

  return multiDomainPrice;
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
      const nativeFioAmount = handlePriceForMultiYearItems({
        includeAddress: true,
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

export const handleFioHandleCartItemsWithCustomDomain = ({
  cartItems,
  item,
  prices,
  roe,
}) => {
  const { id, domain, period } = item;
  const { address: addressPrice } = prices;

  const existingFioHandleOnCustomDomain = cartItems.find(
    cartItem =>
      cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN &&
      cartItem.domain === domain &&
      !cartItem.hasCustomDomainInCart &&
      cartItem.id !== id,
  );

  if (existingFioHandleOnCustomDomain) {
    const { fio, usdc } = convertFioPrices(addressPrice, roe);

    item = {
      ...item,
      hasCustomDomainInCart: true,
      costNativeFio: Number(addressPrice),
      costFio: fio,
      costUsdc: usdc,
    };
    return cartItems.map(cartItem => (cartItem.id === item.id ? item : cartItem));
  }

  const existingFioHandleOnCustomDomainInCart = cartItems.find(
    cartItem =>
      cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN &&
      cartItem.domain === domain &&
      cartItem.hasCustomDomainInCart &&
      cartItem.id !== id,
  );

  if (existingFioHandleOnCustomDomainInCart)
    return cartItems.map(cartItem => {
      if (cartItem.id === existingFioHandleOnCustomDomainInCart.id) {
        const nativeFioAmount = handlePriceForMultiYearItems({
          includeAddress: true,
          prices,
          period,
        });
        const { fio, usdc } = convertFioPrices(nativeFioAmount, roe);

        return {
          ...cartItem,
          hasCustomDomainInCart: false,
          costNativeFio: nativeFioAmount,
          costFio: fio,
          costUsdc: usdc,
          period,
        };
      }

      return cartItem;
    });

  return cartItems;
};

export const cartHasFreeItemsOnDashboardDomains = ({ cartItems, dashboardDomains }) => {
  return (
    cartItems &&
    cartItems.some(cartItem => {
      const { domain, isFree, domainType } = cartItem;
      const existingDashboardDomain = dashboardDomains.find(
        dashboardDomain => dashboardDomain.name === domain,
      );

      return (
        existingDashboardDomain &&
        !existingDashboardDomain.isPremium &&
        isFree &&
        domainType === DOMAIN_TYPE.ALLOW_FREE
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
  const { domainType, isFree, type } = existingItem;

  let handledCartItems = [...cartItems];

  if (
    isFree &&
    type === CART_ITEM_TYPE.ADDRESS &&
    domainType === DOMAIN_TYPE.ALLOW_FREE &&
    !userHasFreeAddress
  ) {
    const allowedFreeItem = cartItems.find(cartItem => {
      const {
        domain: cartItemDomain,
        domainType: cartItemDomainType,
        isFree: cartItemIsFree,
        type: cartItemType,
      } = cartItem;

      const existingDashboardDomain = dashboardDomains.find(
        dashboardDomain => dashboardDomain.name === cartItemDomain,
      );

      return (
        !cartItemIsFree &&
        existingDashboardDomain &&
        !existingDashboardDomain.isPremium &&
        cartItemDomainType === DOMAIN_TYPE.ALLOW_FREE &&
        cartItemType === CART_ITEM_TYPE.ADDRESS
      );
    });

    if (allowedFreeItem) {
      return (handledCartItems = handledCartItems.map(cartItem =>
        cartItem.id === allowedFreeItem.id ? { ...cartItem, isFree: true } : cartItem,
      ));
    }
  }

  return handledCartItems;
};

export const handleUsersFreeCartItems = ({
  cartItems,
  dashboardDomains,
  userHasFreeAddress,
}) => {
  let updatedCartItems = cartItems;

  if (userHasFreeAddress) {
    updatedCartItems = cartItems.map(cartItem => {
      const { domain, domainType, isFree, type } = cartItem;

      if (type !== CART_ITEM_TYPE.ADDRESS) return cartItem;

      const existingDashboardDomain = dashboardDomains.find(
        dashboardDomain => dashboardDomain.name === domain,
      );

      if (
        isFree &&
        domainType === DOMAIN_TYPE.ALLOW_FREE &&
        existingDashboardDomain &&
        !existingDashboardDomain.isPremium
      ) {
        return { ...cartItem, isFree: false };
      }

      return cartItem;
    });
  } else {
    const freeCartItem = cartItems.find(cartItem => {
      const { domain, domainType, isFree, type: cartItemType } = cartItem;

      const existingDashboardDomain = dashboardDomains.find(
        dashboardDomain => dashboardDomain.name === domain,
      );

      return (
        isFree &&
        existingDashboardDomain &&
        !existingDashboardDomain.isPremium &&
        domainType === DOMAIN_TYPE.ALLOW_FREE &&
        cartItemType === CART_ITEM_TYPE.ADDRESS
      );
    });

    const allowedFreeItem = cartItems.find(cartItem => {
      const {
        domain: cartItemDomain,
        domainType: cartItemDomainType,
        isFree: cartItemIsFree,
        type: cartItemType,
      } = cartItem;

      const existingDashboardDomain = dashboardDomains.find(
        dashboardDomain => dashboardDomain.name === cartItemDomain,
      );

      return (
        !freeCartItem &&
        !cartItemIsFree &&
        existingDashboardDomain &&
        !existingDashboardDomain.isPremium &&
        cartItemDomainType === DOMAIN_TYPE.ALLOW_FREE &&
        cartItemType === CART_ITEM_TYPE.ADDRESS
      );
    });

    if (allowedFreeItem) {
      updatedCartItems = cartItems.map(cartItem =>
        cartItem.id === allowedFreeItem.id ? { ...cartItem, isFree: true } : cartItem,
      );
    }
  }

  return updatedCartItems;
};

export const calculateCartTotalCost = ({ cartItems, roe }) => {
  const nativeFioTotalCost = cartItems.reduce((acc, cartItem) => {
    const { costNativeFio, isFree } = cartItem;

    if (isFree) return acc;

    return new MathOp(acc).add(costNativeFio).toNumber();
  }, 0);

  const { fio, usdc } = convertFioPrices(nativeFioTotalCost, roe);

  return {
    costFio: fio,
    costNativeFio: nativeFioTotalCost,
    costUsdc: usdc,
  };
};

export const cartItemsToOrderItems = ({ cartItems, prices, roe }) => {
  const {
    addBundles: addBundlesPrice,
    address: fioHandlePrice,
    domain: fioDomainPrice,
    renewDomain: renewDomainPrice,
  } = prices;
  const orderItems = [];

  for (const cartItem of cartItems) {
    const { address, domain, id, isFree, hasCustomDomainInCart, period, type } = cartItem;

    if (type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN) {
      let domainItem = null;

      if (!hasCustomDomainInCart) {
        domainItem = {
          action: FIO_ACTIONS.registerFioDomain,
          domain,
          nativeFio: fioDomainPrice.toString(),
          price: convertFioPrices(fioDomainPrice, roe).usdc,
          priceCurrency: CURRENCY_CODES.USDC,
          data: {
            cartItemId: id,
          },
        };
      }
      const fioHandleItem = {
        action: FIO_ACTIONS.registerFioAddress,
        address,
        domain,
        nativeFio: fioHandlePrice.toString(),
        price: convertFioPrices(fioHandlePrice, roe).usdc,
        priceCurrency: CURRENCY_CODES.USDC,
        data: {
          cartItemId: id,
        },
      };

      domainItem && orderItems.push(domainItem);
      orderItems.push(fioHandleItem);
      for (let i = 1; i < period; i++) {
        orderItems.push({
          action: FIO_ACTIONS.renewFioDomain,
          address: null,
          domain,
          nativeFio: renewDomainPrice.toString(),
          price: convertFioPrices(renewDomainPrice, roe).usdc,
          priceCurrency: CURRENCY_CODES.USDC,
          data: {
            cartItemId: id,
          },
        });
      }
      continue;
    }

    const orderItem = {
      domain,
      data: {
        cartItemId: id,
      },
    };

    switch (type) {
      case CART_ITEM_TYPE.DOMAIN_RENEWAL:
        {
          orderItem.action = FIO_ACTIONS.renewFioDomain;
          orderItem.address = null;
          orderItem.nativeFio = renewDomainPrice.toString();
          orderItem.price = convertFioPrices(renewDomainPrice, roe).usdc;
          orderItem.priceCurrency = CURRENCY_CODES.USDC;

          for (let i = 1; i < period; i++) {
            orderItems.push(orderItem);
          }
        }
        break;
      case CART_ITEM_TYPE.ADD_BUNDLES:
        orderItem.action = FIO_ACTIONS.addBundledTransactions;
        orderItem.address = address;
        orderItem.nativeFio = addBundlesPrice;
        orderItem.price = convertFioPrices(addBundlesPrice, roe).usdc;
        orderItem.priceCurrency = CURRENCY_CODES.USDC;
        orderItems.push(orderItem);
        break;
      case CART_ITEM_TYPE.ADDRESS:
        orderItem.action = FIO_ACTIONS.registerFioAddress;
        orderItem.address = address;
        orderItem.nativeFio = isFree ? '0' : fioHandlePrice.toString();
        orderItem.price = isFree ? '0' : convertFioPrices(fioHandlePrice, roe).usdc;
        orderItem.priceCurrency = CURRENCY_CODES.USDC;
        orderItems.push(orderItem);
        break;
      case CART_ITEM_TYPE.DOMAIN:
        {
          orderItem.action = FIO_ACTIONS.registerFioDomain;
          orderItem.address = null;
          orderItem.nativeFio = fioDomainPrice.toString();
          orderItem.price = convertFioPrices(fioDomainPrice, roe).usdc;
          orderItem.priceCurrency = CURRENCY_CODES.USDC;

          orderItems.push(orderItem);

          for (let i = 1; i < period; i++) {
            orderItems.push({
              action: FIO_ACTIONS.renewFioDomain,
              address: null,
              domain,
              nativeFio: renewDomainPrice.toString(),
              price: convertFioPrices(renewDomainPrice, roe).usdc,
              priceCurrency: CURRENCY_CODES.USDC,
              data: {
                cartItemId: id,
              },
            });
          }
        }
        break;
      default:
        break;
    }
  }

  return orderItems;
};

export const createCartFromOrder = ({ orderItems, prices, roe }) => {
  let cartItems = [];

  const {
    address: addressPrice,
    addBundles: addBundlesPrice,
    domain: domainPrice,
    renewDomain: renewDomainPrice,
  } = prices;

  for (const orderItem of orderItems) {
    const {
      address,
      domain,
      error,
      errorType,
      id,
      isFree,
      originalAction,
      period,
      type,
    } = orderItem;

    if (
      error.includes(ALREADY_REGISTERED_ERROR_TEXT) &&
      errorType === ORDER_ERROR_TYPES.userHasFreeAddress
    ) {
      continue;
    }

    const existingMultipleYearItem = cartItems.find(
      cartItem => cartItem.orderItemId === id,
    );

    if (existingMultipleYearItem) {
      cartItems = cartItems.map(cartItem => {
        if (cartItem.id === existingMultipleYearItem.id) {
          const nativeFioAmount = handlePriceForMultiYearItems({
            includeAddress: !!address,
            prices,
            period,
          });
          const { fio, usdc } = convertFioPrices(nativeFioAmount, roe);
          return {
            ...cartItem,
            period: cartItem.period++,
            costNativeFio: nativeFioAmount,
            costFio: fio,
            costUsdc: usdc,
          };
        }
        return cartItem;
      });
      continue;
    }

    let cartItemId = null;
    let costNativeFio = null;
    let domainType = null;

    const fioName = fioApi.setFioName(address, domain);
    switch (originalAction) {
      case FIO_ACTIONS.addBundledTransactions:
        cartItemId = `${fioName}-${FIO_ACTIONS.addBundledTransactions}-${+new Date()}`;
        costNativeFio = addBundlesPrice;
        break;
      case FIO_ACTIONS.registerFioAddress:
        cartItemId = fioName;
        costNativeFio = addressPrice;
        domainType = isFree ? DOMAIN_TYPE.ALLOW_FREE : DOMAIN_TYPE.PREMIUM;
        break;
      case FIO_ACTIONS.registerFioDomain:
        cartItemId = fioName;
        costNativeFio = domainPrice;
        break;
      case FIO_ACTIONS.renewFioDomain:
        cartItemId = `${fioName}-${FIO_ACTIONS.renewFioDomain}-${+new Date()}`;
        costNativeFio = renewDomainPrice;
        break;
      default:
        null;
    }

    const { fio, usdc } = convertFioPrices(costNativeFio, roe);

    cartItems.push({
      address,
      domain,
      domainType,
      costFio: fio,
      costNativeFio,
      costUsdc: usdc,
      id: cartItemId,
      isFree,
      orderItemId: id,
      period: 1,
      type,
    });
  }

  return cartItems.map(cartItem => {
    delete cartItem.orderItemId;
    return cartItem;
  });
};

import MathOp from 'big.js';

import {
  CART_ITEM_TYPE,
  FIO_ACTIONS,
  ORDER_ERROR_TYPES,
  WALLET_CREATED_FROM,
} from '../config/constants';

import { fioApi } from '../external/fio.mjs';
import { DOMAIN_TYPE } from '../constants/cart.mjs';
import { CURRENCY_CODES } from '../constants/fio.mjs';
import { getROE } from '../external/roe';

const ALREADY_REGISTERED_ERROR_TEXT = 'already registered';

export const handlePrices = async ({ prices, roe }) => {
  const dbPrices = await fioApi.getPrices(true);
  const dbRoe = await getROE();

  const {
    addBundles: addBundlesPrice,
    address: addressPrice,
    domain: domainPrice,
    combo: comboPrice,
    renewDomain: renewDomainPrice,
  } = prices;

  const {
    addBundles: addBundlesDbPrice,
    address: addressDbPrice,
    domain: domainDbPrice,
    combo: comboDbPrice,
    renewDomain: renewDomainDbPrice,
  } = dbPrices;

  return {
    handledPrices: {
      addBundles: Number(addBundlesPrice || addBundlesDbPrice),
      address: Number(addressPrice || addressDbPrice),
      domain: Number(domainPrice || domainDbPrice),
      combo: Number(comboPrice || comboDbPrice),
      renewDomain: Number(renewDomainPrice || renewDomainDbPrice),
    },
    handledRoe: roe || dbRoe,
  };
};

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

export const cartHasFreeItemsOnDomains = ({ cartItems, domains }) => {
  return (
    cartItems &&
    cartItems.some(cartItem => {
      const { domain, isFree, domainType } = cartItem;
      const existingDomain = domains.find(domainItem => domainItem.name === domain);

      return (
        existingDomain &&
        !existingDomain.isPremium &&
        isFree &&
        domainType === DOMAIN_TYPE.ALLOW_FREE
      );
    })
  );
};

export const handleFreeCartAddItem = ({
  allRefProfileDomains,
  cartItems,
  dashboardDomains,
  freeDomainOwner,
  item,
  userHasFreeAddress,
}) => {
  const { domain, type } = item;

  const domainsArr = [
    ...dashboardDomains,
    ...allRefProfileDomains.filter(refProfileDomain => !refProfileDomain.isFirstRegFree),
  ];

  const isFirstRegFreeDomains = allRefProfileDomains.filter(
    refProfile => refProfile.isFirstRegFree,
  );

  const existingUsersFreeAddress =
    userHasFreeAddress &&
    userHasFreeAddress.find(freeAddress => freeAddress.name.split('@')[1] === domain);

  if (type === CART_ITEM_TYPE.ADDRESS) {
    const existingDashboardDomain = domainsArr.find(
      dashboardDomain => dashboardDomain.name === domain,
    );
    const existingIsFirstRegFree = isFirstRegFreeDomains.find(
      isFirstRegFreeDomain => isFirstRegFreeDomain.name === domain,
    );

    if (
      (existingDashboardDomain &&
        !existingDashboardDomain.isPremium &&
        (!userHasFreeAddress || (userHasFreeAddress && !userHasFreeAddress.length)) &&
        !cartHasFreeItemsOnDomains({
          cartItems,
          domains: [...domainsArr, ...isFirstRegFreeDomains],
        })) ||
      (!existingDashboardDomain && freeDomainOwner) ||
      (!existingDashboardDomain &&
        existingIsFirstRegFree &&
        !existingIsFirstRegFree.isPremium &&
        (!userHasFreeAddress ||
          (userHasFreeAddress && !userHasFreeAddress.length) ||
          (userHasFreeAddress && !existingUsersFreeAddress)) &&
        !cartHasFreeItemsOnDomains({
          cartItems,
          domains: [...domainsArr, ...isFirstRegFreeDomains],
        }))
    ) {
      return { ...item, isFree: true };
    }
    return { ...item, isFree: false };
  }

  return item;
};

export const handleFreeCartDeleteItem = ({
  allRefProfileDomains,
  cartItems,
  dashboardDomains,
  existingItem,
  userHasFreeAddress,
}) => {
  const { domainType, isFree, type } = existingItem;

  const domainsArr = [
    ...dashboardDomains,
    ...allRefProfileDomains.filter(refProfileDomain => !refProfileDomain.isFirstRegFree),
  ];

  const isFirstRegFreeDomains = allRefProfileDomains.filter(
    refProfile => refProfile.isFirstRegFree,
  );

  if (
    isFree &&
    type === CART_ITEM_TYPE.ADDRESS &&
    domainType === DOMAIN_TYPE.ALLOW_FREE
  ) {
    const allowedFreeItem = cartItems.find(cartItem => {
      const {
        domain: cartItemDomain,
        domainType: cartItemDomainType,
        isFree: cartItemIsFree,
        type: cartItemType,
      } = cartItem;

      const existingDashboardDomain = domainsArr.find(
        domainItem => domainItem.name === cartItemDomain,
      );
      const existingIsFirstRegFree = isFirstRegFreeDomains.find(
        isFirstRegFreeDomain => isFirstRegFreeDomain.name === cartItemDomain,
      );

      const existingUsersFreeAddress =
        userHasFreeAddress &&
        userHasFreeAddress.find(
          freeAddress => freeAddress.name.split('@')[1] === cartItemDomain,
        );

      return (
        !cartItemIsFree &&
        ((existingDashboardDomain &&
          !existingDashboardDomain.isPremium &&
          (!userHasFreeAddress || (userHasFreeAddress && !userHasFreeAddress.length))) ||
          (!existingDashboardDomain &&
            existingIsFirstRegFree &&
            !existingIsFirstRegFree.isPremium &&
            (!userHasFreeAddress ||
              (userHasFreeAddress && !userHasFreeAddress.length) ||
              (userHasFreeAddress &&
                userHasFreeAddress.length &&
                !existingUsersFreeAddress)))) &&
        cartItemDomainType === DOMAIN_TYPE.ALLOW_FREE &&
        cartItemType === CART_ITEM_TYPE.ADDRESS
      );
    });

    if (allowedFreeItem) {
      return cartItems.map(cartItem =>
        cartItem.id === allowedFreeItem.id ? { ...cartItem, isFree: true } : cartItem,
      );
    }
  }

  return [...cartItems];
};

export const handleUsersFreeCartItems = ({
  allRefProfileDomains,
  cartItems,
  dashboardDomains,
  userHasFreeAddress,
}) => {
  let updatedCartItems = cartItems;

  const domainsArr = [
    ...dashboardDomains,
    ...allRefProfileDomains.filter(refProfileDomain => !refProfileDomain.isFirstRegFree),
  ];

  const isFirstRegFreeDomains = allRefProfileDomains.filter(
    refProfile => refProfile.isFirstRegFree,
  );

  if (userHasFreeAddress && userHasFreeAddress.length) {
    updatedCartItems = cartItems.map(cartItem => {
      const { domain, domainType, isFree, type } = cartItem;

      if (type !== CART_ITEM_TYPE.ADDRESS) return cartItem;

      const existingDashboardDomain = domainsArr.find(
        domainItem => domainItem.name === domain,
      );
      const existingIsFirstRegFree = isFirstRegFreeDomains.find(
        isFirstRegFreeDomain => isFirstRegFreeDomain.name === domain,
      );

      const existingUsersFreeAddress = userHasFreeAddress.find(
        freeAddress => freeAddress.name.split('@')[1] === domain,
      );

      if (
        isFree &&
        domainType === DOMAIN_TYPE.ALLOW_FREE &&
        ((existingDashboardDomain && !existingDashboardDomain.isPremium) ||
          (!existingDashboardDomain &&
            existingIsFirstRegFree &&
            !existingIsFirstRegFree.isPremium &&
            existingUsersFreeAddress))
      ) {
        return { ...cartItem, isFree: false };
      }

      return cartItem;
    });
  } else {
    const freeCartItem = cartItems.find(cartItem => {
      const { domain, domainType, isFree, type: cartItemType } = cartItem;

      const existingDashboardDomain = domainsArr.find(
        domainItem => domainItem.name === domain,
      );

      const existingIsFirstRegFree = isFirstRegFreeDomains.find(
        isFirstRegFreeDomain => isFirstRegFreeDomain.name === domain,
      );

      return (
        isFree &&
        ((existingDashboardDomain && !existingDashboardDomain.isPremium) ||
          (!existingDashboardDomain &&
            existingIsFirstRegFree &&
            !existingIsFirstRegFree.isPremium)) &&
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

      const existingDashboardDomain = domainsArr.find(
        domainItem => domainItem.name === cartItemDomain,
      );

      const existingIsFirstRegFree = isFirstRegFreeDomains.find(
        isFirstRegFreeDomain => isFirstRegFreeDomain.name === cartItemDomain,
      );

      return (
        !freeCartItem &&
        !cartItemIsFree &&
        ((existingDashboardDomain && !existingDashboardDomain.isPremium) ||
          (!existingDashboardDomain &&
            existingIsFirstRegFree &&
            !existingIsFirstRegFree.isPremium)) &&
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
    const { costNativeFio, isFree, type } = cartItem;

    if (isFree && type === CART_ITEM_TYPE.ADDRESS) return acc;

    return new MathOp(acc).add(costNativeFio).toNumber();
  }, 0);

  const { fio, usdc } = convertFioPrices(nativeFioTotalCost, roe);

  return {
    costFio: fio,
    costNativeFio: nativeFioTotalCost,
    costUsdc: usdc,
  };
};

export const cartItemsToOrderItems = async ({
  allRefProfileDomains,
  cartItems,
  dashboardDomains,
  FioAccountProfile,
  prices,
  roe,
  userHasFreeAddress,
  walletType,
}) => {
  const {
    addBundles: addBundlesPrice,
    address: fioHandlePrice,
    domain: fioDomainPrice,
    combo: fioDomainHandlePrice,
    renewDomain: renewDomainPrice,
  } = prices;
  const orderItems = [];

  const domainsArr = [
    ...dashboardDomains,
    ...allRefProfileDomains.filter(refProfileDomain => !refProfileDomain.isFirstRegFree),
  ];

  const isFirstRegFreeDomains = allRefProfileDomains.filter(
    refProfile => refProfile.isFirstRegFree,
  );

  for (const cartItem of cartItems) {
    const { address, domain, id, isFree, hasCustomDomainInCart, period, type } = cartItem;

    const orderItem = {
      domain,
      priceCurrency: CURRENCY_CODES.USDC,
      data: { cartItemId: id },
    };

    const renewOrderItem = {
      ...orderItem,
      action: FIO_ACTIONS.renewFioDomain,
      address: null,
      nativeFio: renewDomainPrice.toString(),
      price: convertFioPrices(renewDomainPrice, roe).usdc,
    };

    const domainOrderItem = {
      ...orderItem,
      address: null,
      action: FIO_ACTIONS.registerFioDomain,
      nativeFio: fioDomainPrice.toString(),
      price: convertFioPrices(fioDomainPrice, roe).usdc,
    };

    switch (type) {
      case CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN:
        {
          const supportCombo =
            walletType === WALLET_CREATED_FROM.EDGE ||
            walletType === WALLET_CREATED_FROM.METAMASK;
          const useComboAction = !hasCustomDomainInCart && supportCombo;

          if (!supportCombo && !hasCustomDomainInCart) {
            orderItems.push(domainOrderItem);
          }

          orderItem.action = useComboAction
            ? FIO_ACTIONS.registerFioDomainAddress
            : FIO_ACTIONS.registerFioAddress;
          orderItem.address = address;
          orderItem.nativeFio = (useComboAction
            ? fioDomainHandlePrice
            : fioHandlePrice
          ).toString();
          orderItem.price = convertFioPrices(
            useComboAction ? fioDomainHandlePrice : fioHandlePrice,
            roe,
          ).usdc;
          orderItems.push(orderItem);

          if (!hasCustomDomainInCart) {
            for (let i = 1; i < Number(period); i++) {
              orderItems.push(renewOrderItem);
            }
          }
        }
        break;
      case CART_ITEM_TYPE.DOMAIN_RENEWAL:
        {
          for (let i = 0; i < Number(period); i++) {
            orderItems.push(renewOrderItem);
          }
        }
        break;
      case CART_ITEM_TYPE.ADD_BUNDLES:
        orderItem.action = FIO_ACTIONS.addBundledTransactions;
        orderItem.address = address;
        orderItem.nativeFio = addBundlesPrice;
        orderItem.price = convertFioPrices(addBundlesPrice, roe).usdc;
        orderItems.push(orderItem);
        break;
      case CART_ITEM_TYPE.ADDRESS: {
        const freeDomainOwner = await FioAccountProfile.getDomainOwner(domain);

        const existingDashboardDomain = domainsArr.find(
          domainItem => domainItem.name === domain,
        );
        const existingIsFirstRegFree = isFirstRegFreeDomains.find(
          isFirstRegFreeDomain => isFirstRegFreeDomain.name === domain,
        );

        const existingUsersFreeAddress =
          userHasFreeAddress &&
          userHasFreeAddress.find(
            freeAddress => freeAddress.name.split('@')[1] === domain,
          );

        const userableRegisterFree =
          (existingDashboardDomain &&
            !existingDashboardDomain.isPremium &&
            (!userHasFreeAddress || (userHasFreeAddress && !userHasFreeAddress.length)) &&
            !cartItems.some(cartItem => cartItem.isFree && cartItem.id !== id)) ||
          (!existingDashboardDomain && freeDomainOwner) ||
          (!existingDashboardDomain &&
            existingIsFirstRegFree &&
            !existingIsFirstRegFree.isPremium &&
            (!userHasFreeAddress ||
              (userHasFreeAddress && !userHasFreeAddress.length) ||
              (userHasFreeAddress.length && !existingUsersFreeAddress)) &&
            !cartItems.some(cartItem => cartItem.isFree && cartItem.id !== id));

        orderItem.action = FIO_ACTIONS.registerFioAddress;
        orderItem.address = address;
        orderItem.nativeFio =
          isFree && userableRegisterFree ? '0' : fioHandlePrice.toString();
        orderItem.price =
          isFree && userableRegisterFree
            ? '0'
            : convertFioPrices(fioHandlePrice, roe).usdc;
        orderItems.push(orderItem);
        break;
      }
      case CART_ITEM_TYPE.DOMAIN:
        {
          orderItems.push(domainOrderItem);

          for (let i = 1; i < Number(period); i++) {
            orderItems.push(renewOrderItem);
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
      errorType !== ORDER_ERROR_TYPES.userHasFreeAddress
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
        domainType = DOMAIN_TYPE.CUSTOM;
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
      isFree: isFree && errorType !== ORDER_ERROR_TYPES.userHasFreeAddress,
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

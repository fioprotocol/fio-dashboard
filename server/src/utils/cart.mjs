import { GenericAction } from '@fioprotocol/fiosdk';

import { Payment } from '../models/Payment.mjs';

import MathOp from '../services/math.mjs';

import { transformOrderItemCostToPriceString, combineOrderItems } from './order.mjs';
import {
  CART_ITEM_TYPE,
  FIO_ADDRESS_DELIMITER,
  FIO_ACTIONS_LABEL,
  ORDER_ERROR_TYPES,
  WALLET_CREATED_FROM,
} from '../config/constants';

import { fioApi } from '../external/fio.mjs';
import { DOMAIN_TYPE } from '../constants/cart.mjs';
import { CURRENCY_CODES } from '../constants/fio.mjs';

const ALREADY_REGISTERED_ERROR_TEXT = 'already registered';

export function convertFioPrices(nativeFio, roe) {
  const fioAmount = fioApi.sufToAmount(nativeFio || 0);

  return {
    nativeFio,
    fio: fioAmount,
    usdc:
      nativeFio != null && roe != null ? fioApi.convertFioToUsdc(nativeFio, roe) : '0',
  };
}

export const handlePriceForMultiYearItems = ({
  includeAddress,
  prices,
  period,
  onlyRenew,
}) => {
  const { domain, renewDomain, combo } = prices;

  const renewPeriod = onlyRenew
    ? new MathOp(period).toNumber()
    : new MathOp(period).sub(1).toNumber();

  const renewDomainNativeCost = new MathOp(renewDomain).mul(renewPeriod).toString();

  const multiDomainPrice = onlyRenew
    ? renewDomainNativeCost
    : new MathOp(domain).add(renewDomainNativeCost).toString();

  if (includeAddress) {
    if (renewPeriod > 0) {
      return new MathOp(combo).add(renewDomainNativeCost).toString();
    } else {
      return combo;
    }
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
      costNativeFio: addressPrice,
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

export const handleFreeItems = ({
  domainsList,
  cartItems,
  freeDomainToOwner,
  userHasFreeAddress,
  userRefCode,
  noAuth = false,
}) => {
  const regularDomains = domainsList.filter(refProfile => !refProfile.isFirstRegFree);
  const firstRegFreeDomains = domainsList.filter(refProfile => refProfile.isFirstRegFree);

  const newList = cartItems.map(item => {
    const newItem = { ...item };
    delete newItem.isFree;
    return newItem;
  });

  for (const cartItem of cartItems) {
    const { domain, type } = cartItem;

    if (type !== CART_ITEM_TYPE.ADDRESS) {
      continue;
    }
    const newCartItemIndex = newList.findIndex(({ id }) => id === cartItem.id);

    const isFreeAddressOnDomainExist =
      !!userHasFreeAddress &&
      !!userHasFreeAddress.find(
        freeAddress => freeAddress.name.split(FIO_ADDRESS_DELIMITER)[1] === domain,
      );

    const existingDomain = domainsList.find(
      dashboardDomain =>
        dashboardDomain.name === domain &&
        (noAuth ||
          (!userRefCode && !dashboardDomain.code) ||
          userRefCode === dashboardDomain.code),
    );

    const existingRegularDomain = regularDomains.find(
      dashboardDomain =>
        dashboardDomain.name === domain &&
        (noAuth ||
          (!userRefCode && !dashboardDomain.code) ||
          userRefCode === dashboardDomain.code),
    );

    const existingIsFirstRegFreeDomain = firstRegFreeDomains.find(
      isFirstRegFreeDomain =>
        isFirstRegFreeDomain.name === domain &&
        (noAuth ||
          (!userRefCode && !isFirstRegFreeDomain.code) ||
          userRefCode === isFirstRegFreeDomain.code),
    );

    const otherCartItems = [...newList];
    otherCartItems.splice(newCartItemIndex, 1);
    const isCartHasFreeItemsOnDomains = cartHasFreeItemsOnDomains({
      cartItems: otherCartItems,
      domains: [...regularDomains],
    });
    const isCartHasFreeItemsFirstRegFreeOnDomains = cartHasFreeItemsOnDomains({
      cartItems: otherCartItems,
      domains: [{ name: domain }],
    });

    // Defines if user can have its first free fch
    const defaultFirstFCHFree =
      existingRegularDomain &&
      !existingRegularDomain.isPremium &&
      (!userHasFreeAddress || (userHasFreeAddress && !userHasFreeAddress.length)) &&
      !isCartHasFreeItemsOnDomains;
    // Defines if user can have free fch with twitter or metamask domain
    const fioAccountFree = !existingDomain && !!freeDomainToOwner[domain];
    // Defines if user can have additional free FCH for ref profile
    const additionalFreeFCH =
      existingIsFirstRegFreeDomain &&
      !existingIsFirstRegFreeDomain.isPremium &&
      (!userHasFreeAddress ||
        (userHasFreeAddress && !userHasFreeAddress.length) ||
        (userHasFreeAddress && !isFreeAddressOnDomainExist)) &&
      !isCartHasFreeItemsFirstRegFreeOnDomains;

    newList.splice(newCartItemIndex, 1, {
      ...cartItem,
      isFree: defaultFirstFCHFree || fioAccountFree || additionalFreeFCH,
    });
  }

  return newList;
};

export const handleFreeCartAddItem = ({
  cartItems,
  domainsList,
  item,
  freeDomainToOwner,
  userHasFreeAddress,
  userRefCode,
  noAuth,
}) => {
  const { type } = item;

  if (type !== CART_ITEM_TYPE.ADDRESS) {
    return item;
  }

  return handleFreeItems({
    cartItems: [...cartItems, item],
    domainsList,
    freeDomainToOwner,
    userHasFreeAddress,
    userRefCode,
    noAuth,
  }).pop();
};

export const handleFreeCartDeleteItem = ({
  cartItems,
  domainsList,
  existingItem,
  freeDomainToOwner,
  userHasFreeAddress,
  userRefCode,
  noAuth,
}) => {
  const { domainType, isFree, type } = existingItem;

  if (
    !isFree ||
    type !== CART_ITEM_TYPE.ADDRESS ||
    domainType !== DOMAIN_TYPE.ALLOW_FREE
  ) {
    return [...cartItems];
  }

  return [
    existingItem,
    ...handleFreeItems({
      cartItems: cartItems.filter(cartItem => cartItem.id !== existingItem.id),
      domainsList,
      freeDomainToOwner,
      userHasFreeAddress,
      userRefCode,
      noAuth,
    }),
  ];
};

export const calculateCartTotalCost = ({ cartItems, roe }) => {
  const nativeFioTotalCost = cartItems.reduce((acc, cartItem) => {
    const { costNativeFio, isFree, type } = cartItem;

    if (isFree && type === CART_ITEM_TYPE.ADDRESS) return acc;

    return new MathOp(acc).add(costNativeFio).toString();
  }, '0');

  const { fio, usdc } = convertFioPrices(nativeFioTotalCost, roe);

  return {
    costFio: fio,
    costNativeFio: nativeFioTotalCost,
    costUsdc: usdc,
  };
};

export const cartItemsToOrderItems = async ({
  cartItems,
  prices,
  roe,
  walletType,
  paymentProcessor,
  domainsList,
  freeDomainToOwner,
  userRefCode,
  userHasFreeAddress,
}) => {
  const {
    addBundles: addBundlesPrice,
    address: fioHandlePrice,
    domain: fioDomainPrice,
    combo: fioDomainHandlePrice,
    renewDomain: renewDomainPrice,
  } = prices;
  const orderItems = [];
  cartItems = handleFreeItems({
    cartItems,
    domainsList,
    freeDomainToOwner,
    userHasFreeAddress,
    userRefCode,
  });

  for (const cartItem of cartItems) {
    const { address, domain, id, isFree, hasCustomDomainInCart, period, type } = cartItem;

    const orderItem = {
      domain,
      priceCurrency: CURRENCY_CODES.USDC,
      data: { cartItemId: id },
    };

    const renewOrderItem = {
      ...orderItem,
      action: GenericAction.renewFioDomain,
      address: null,
      nativeFio: renewDomainPrice.toString(),
      price: convertFioPrices(renewDomainPrice, roe).usdc,
    };

    const domainOrderItem = {
      ...orderItem,
      address: null,
      action: GenericAction.registerFioDomain,
      nativeFio: fioDomainPrice.toString(),
      price: convertFioPrices(fioDomainPrice, roe).usdc,
    };

    switch (type) {
      case CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN: {
        const supportCombo =
          walletType !== WALLET_CREATED_FROM.LEDGER ||
          paymentProcessor !== Payment.PROCESSOR.FIO;
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
        orderItem.nativeFio = addBundlesPrice;
        orderItem.price = convertFioPrices(addBundlesPrice, roe).usdc;
        orderItems.push(orderItem);
        break;
      case CART_ITEM_TYPE.ADDRESS: {
        orderItem.action = GenericAction.registerFioAddress;
        orderItem.address = address;
        orderItem.nativeFio = isFree ? '0' : fioHandlePrice.toString();
        orderItem.price = isFree ? '0' : convertFioPrices(fioHandlePrice, roe).usdc;
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

export const createCartFromOrder = ({ orderItems, prices, roe }) => {
  let cartItems = [];

  const {
    address: addressPrice,
    addBundles: addBundlesPrice,
    combo: comboPrice,
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
      error &&
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
      case GenericAction.addBundledTransactions:
        cartItemId = `${fioName}-${GenericAction.addBundledTransactions}-${+new Date()}`;
        costNativeFio = addBundlesPrice;
        break;
      case GenericAction.registerFioAddress:
        cartItemId = fioName;
        costNativeFio = addressPrice;
        domainType = isFree ? DOMAIN_TYPE.ALLOW_FREE : DOMAIN_TYPE.PREMIUM;
        break;
      case GenericAction.registerFioDomain:
        cartItemId = fioName;
        costNativeFio = domainPrice;
        domainType = DOMAIN_TYPE.CUSTOM;
        break;
      case GenericAction.renewFioDomain:
        cartItemId = `${fioName}-${GenericAction.renewFioDomain}-${+new Date()}`;
        costNativeFio = renewDomainPrice;
        break;
      case GenericAction.registerFioDomainAddress:
        cartItemId = fioName;
        costNativeFio = comboPrice;
        domainType = DOMAIN_TYPE.CUSTOM;
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

export const getItemCost = ({ item, prices, roe }) => {
  const { type, period, hasCustomDomainInCart } = item;
  const { address, addBundles, renewDomain } = prices;

  let costNativeFio;
  let costItemNativeFio; // cost for item for period 1 when applicable

  switch (type) {
    case CART_ITEM_TYPE.ADD_BUNDLES:
      costNativeFio = addBundles;
      break;
    case CART_ITEM_TYPE.ADDRESS:
      costNativeFio = address;
      break;
    case CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN: {
      if (hasCustomDomainInCart) {
        costNativeFio = address;
      } else {
        costNativeFio = handlePriceForMultiYearItems({
          includeAddress: true,
          prices,
          period,
        });
        costItemNativeFio = prices.combo;
      }
      break;
    }
    case CART_ITEM_TYPE.DOMAIN: {
      costNativeFio = handlePriceForMultiYearItems({
        includeAddress: false,
        prices,
        period,
      });
      costItemNativeFio = prices.domain;
      break;
    }
    case CART_ITEM_TYPE.DOMAIN_RENEWAL:
      costNativeFio = new MathOp(renewDomain).mul(period).toString();
      break;
    default:
      throw new Error('Unknown cart item type');
  }

  const { fio, usdc } = convertFioPrices(costNativeFio, roe);
  const { fio: costItemFio, usdc: costItemUsdc } = costItemNativeFio
    ? convertFioPrices(costItemNativeFio, roe)
    : { fio, usdc };

  return {
    costNativeFio,
    costFio: fio,
    costUsdc: usdc,
    costItemFio,
    costItemUsdc,
  };
};

export const recalculateCartItems = ({ items, prices, roe }) =>
  items.map(cartItem => {
    const { costNativeFio, costFio, costUsdc, costItemFio, costItemUsdc } = getItemCost({
      item: cartItem,
      prices,
      roe,
    });

    if (!costNativeFio) {
      throw new Error('NO_NATIVE_FIO_AMOUNT');
    }

    return {
      ...cartItem,
      costNativeFio,
      costFio,
      costUsdc,
      costItemFio,
      costItemUsdc,
    };
  });

export const getOrderItemType = orderItem => {
  const { action, address, data } = orderItem;
  const { hasCustomDomain } = data || {};

  if (action === GenericAction.renewFioDomain) {
    return CART_ITEM_TYPE.DOMAIN_RENEWAL;
  } else if (action === GenericAction.addBundledTransactions) {
    return CART_ITEM_TYPE.ADD_BUNDLES;
  } else if (!address) {
    return CART_ITEM_TYPE.DOMAIN;
  } else if (
    action === GenericAction.registerFioDomainAddress ||
    (address && hasCustomDomain)
  ) {
    return CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;
  } else {
    return CART_ITEM_TYPE.ADDRESS;
  }
};

export const getDisplayOrderItems = ({ orderItems, roe }) => {
  const combinedItems = combineOrderItems({
    orderItems: orderItems
      .sort((a, b) => a.id - b.id)
      .map(orderItem => {
        const { action, address, data, domain, price, nativeFio } = orderItem;

        const isFree = price === '0';
        const { cartItemId } = data || {};
        const fioName = address ? `${address}${FIO_ADDRESS_DELIMITER}${domain}` : domain;
        const itemType = getOrderItemType(orderItem);
        const hasCustomDomain = itemType === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;

        return {
          action: hasCustomDomain
            ? FIO_ACTIONS_LABEL[
                `${GenericAction.registerFioAddress}_${GenericAction.registerFioDomain}`
              ]
            : FIO_ACTIONS_LABEL[action],
          originalAction: action,
          address,
          domain,
          fee_collected: isFree ? null : nativeFio,
          costUsdc: price,
          type: itemType,
          id: cartItemId || fioName,
          isFree,
          hasCustomDomain,
          priceString: transformOrderItemCostToPriceString({
            fioNativeAmount: nativeFio,
            usdcAmount: price,
            isFree,
          }),
        };
      }),
  });

  const displayItems = [];

  for (const item of combinedItems) {
    const {
      id,
      address,
      domain,
      type,
      originalAction,
      isFree,
      period,
      fee_collected,
      priceString,
    } = item;

    let cartItemId = null;
    let costNativeFio = fee_collected;
    let domainType = null;

    const fioName = fioApi.setFioName(address, domain);
    switch (originalAction) {
      case GenericAction.addBundledTransactions:
        cartItemId = `${fioName}-${GenericAction.addBundledTransactions}-${+new Date()}`;
        costNativeFio = fee_collected;
        break;
      case GenericAction.registerFioAddress:
        cartItemId = fioName;
        costNativeFio = fee_collected;
        domainType = isFree ? DOMAIN_TYPE.ALLOW_FREE : DOMAIN_TYPE.PREMIUM;
        break;
      case GenericAction.registerFioDomain:
        cartItemId = fioName;
        domainType = DOMAIN_TYPE.CUSTOM;
        break;
      case GenericAction.renewFioDomain:
        cartItemId = `${fioName}-${GenericAction.renewFioDomain}-${+new Date()}`;
        break;
      case GenericAction.registerFioDomainAddress:
        cartItemId = fioName;
        domainType = DOMAIN_TYPE.CUSTOM;
        break;
      default:
        null;
    }

    const { fio, usdc } = convertFioPrices(costNativeFio, roe);

    displayItems.push({
      orderItemId: id,
      id: cartItemId,
      address,
      domain,
      domainType,
      type,
      costFio: fio,
      costNativeFio,
      costUsdc: usdc,
      isFree,
      period,
      priceString,
    });
  }

  return displayItems.map(displayItem => {
    delete displayItem.orderItemId;
    return displayItem;
  });
};

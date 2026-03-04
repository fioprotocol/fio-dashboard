import { GenericAction } from '@fioprotocol/fiosdk';

import { CART_ITEM_TYPE } from '../config/constants.js';
import { TOO_LONG_DOMAIN_RENEWAL_YEAR } from '../constants/fio.mjs';
import { convertToNewDate } from './general.mjs';
import { fioApi } from '../external/fio.mjs';

const REGISTRATION_ACTIONS = [
  GenericAction.registerFioAddress,
  GenericAction.registerFioDomain,
  GenericAction.registerFioDomainAddress,
];

export const findDuplicateRegistrations = ({ cartItems, activeOrderItems }) => {
  if (!cartItems || !activeOrderItems || !activeOrderItems.length) return [];

  const activeRegistrations = activeOrderItems.filter(item =>
    REGISTRATION_ACTIONS.includes(item.action),
  );

  if (!activeRegistrations.length) return [];

  const duplicates = [];

  for (const cartItem of cartItems) {
    const { type, domain, address } = cartItem;

    if (type === CART_ITEM_TYPE.DOMAIN_RENEWAL || type === CART_ITEM_TYPE.ADD_BUNDLES) {
      continue;
    }

    const isDomainOnlyType =
      type === CART_ITEM_TYPE.DOMAIN ||
      type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;

    const isDuplicate = activeRegistrations.some(orderItem => {
      if (orderItem.domain !== domain) return false;

      if (isDomainOnlyType) {
        return REGISTRATION_ACTIONS.includes(orderItem.action);
      }

      return orderItem.address === address;
    });

    if (isDuplicate) {
      duplicates.push(cartItem);
    }
  }

  return duplicates;
};

export const countPendingRenewalsPerDomain = ({ activeOrderItems }) => {
  if (!activeOrderItems || !activeOrderItems.length) return {};

  const renewals = {};

  for (const item of activeOrderItems) {
    if (item.action === GenericAction.renewFioDomain && item.domain) {
      renewals[item.domain] = (renewals[item.domain] || 0) + 1;
    }
  }

  return renewals;
};

export const getCartWarnings = async ({ cartItems, activeOrderItems }) => {
  if (!activeOrderItems || !activeOrderItems.length) return null;

  const duplicateRegistrations = findDuplicateRegistrations({
    cartItems,
    activeOrderItems,
  });

  let hasRenewalExceedsLimit = false;

  const renewalItems = cartItems
    ? cartItems.filter(
        item => item.type === CART_ITEM_TYPE.DOMAIN_RENEWAL && item.domain && item.period,
      )
    : [];

  for (const cartItem of renewalItems) {
    const otherCartItems = cartItems.filter(item => item !== cartItem);
    const domainFromChain = await fioApi.getFioDomain(cartItem.domain);

    const { exceedsLimit } = checkRenewalYearLimit({
      domain: cartItem.domain,
      renewalPeriod: Number(cartItem.period),
      chainExpirationDate: domainFromChain && domainFromChain.expiration,
      activeOrderItems,
      cartItems: otherCartItems,
    });

    if (exceedsLimit) {
      hasRenewalExceedsLimit = true;
      break;
    }
  }

  const hasDuplicates = duplicateRegistrations.length > 0;

  if (!hasDuplicates && !hasRenewalExceedsLimit) return null;

  return {
    ...(hasDuplicates
      ? { duplicateRegistrations: duplicateRegistrations.map(item => item.id) }
      : {}),
    ...(hasRenewalExceedsLimit ? { hasPendingRenewals: true } : {}),
  };
};

export const countCartRenewalYearsForDomain = ({ cartItems, domain }) => {
  if (!cartItems || !cartItems.length) return 0;

  let years = 0;

  for (const item of cartItems) {
    if (item.domain !== domain || !item.period) continue;

    if (item.type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
      years += Number(item.period);
    } else if (
      item.type === CART_ITEM_TYPE.DOMAIN ||
      item.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
    ) {
      years += Math.max(0, Number(item.period) - 1);
    }
  }

  return years;
};

export const checkRenewalYearLimit = ({
  domain,
  renewalPeriod,
  chainExpirationDate,
  activeOrderItems,
  cartItems,
}) => {
  const pendingRenewals = countPendingRenewalsPerDomain({
    activeOrderItems: activeOrderItems || [],
  });
  const pendingOrderYears = pendingRenewals[domain] || 0;
  const cartRenewalYears = countCartRenewalYearsForDomain({
    cartItems: cartItems || [],
    domain,
  });

  const expirationDate = chainExpirationDate
    ? convertToNewDate(chainExpirationDate)
    : new Date();
  const currentExpYear = expirationDate.getFullYear();
  const totalPendingYears = pendingOrderYears + cartRenewalYears;
  const maxRemaining = TOO_LONG_DOMAIN_RENEWAL_YEAR - currentExpYear - totalPendingYears;

  return {
    exceedsLimit: renewalPeriod > maxRemaining,
    maxRemainingYears: Math.max(0, maxRemaining),
  };
};

export const isCartItemDuplicateRegistration = ({ item, activeOrderItems }) => {
  if (!activeOrderItems || !activeOrderItems.length) return false;

  const { type, domain, address } = item;

  if (type === CART_ITEM_TYPE.DOMAIN_RENEWAL || type === CART_ITEM_TYPE.ADD_BUNDLES) {
    return false;
  }

  const isDomainOnlyType =
    type === CART_ITEM_TYPE.DOMAIN || type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;

  return activeOrderItems.some(orderItem => {
    if (!REGISTRATION_ACTIONS.includes(orderItem.action)) return false;
    if (orderItem.domain !== domain) return false;

    if (isDomainOnlyType) return true;

    return orderItem.address === address;
  });
};

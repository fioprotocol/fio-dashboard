import { createSelector } from 'reselect';

import { prefix } from './actions';
import { DOMAIN_TYPE } from '../../constants/fio';

import { fioDomains } from '../fio/selectors';
import { domains } from '../registrations/selectors';

import { ReduxState } from '../init';
import { CartItem } from '../../types';

export const loading = (state: ReduxState): boolean => state[prefix].loading;

export const cartId = (state: ReduxState): string =>
  state[prefix].cartId || null;

export const cartItems = (state: ReduxState): CartItem[] =>
  state[prefix].cartItems || [];

export const paymentWalletPublicKey = (state: ReduxState): string =>
  state[prefix].paymentWalletPublicKey || '';

export const cartHasItemsWithPrivateDomain = createSelector(
  cartItems,
  fioDomains,
  domains,
  (cartItems, fioDomains, publicDomains) => {
    const privateDomains: string[] = fioDomains.reduce((acc, fioDomain) => {
      if (!fioDomain.isPublic) acc.push(fioDomain.name);

      return acc;
    }, []);

    for (const cartItem of cartItems) {
      if (
        cartItem.address &&
        (privateDomains.indexOf(cartItem.domain) > -1 ||
          (!!cartItem.address && cartItem.domainType === DOMAIN_TYPE.CUSTOM))
      )
        return true;
    }

    return false;
  },
);

export const isCartPrivateDomainsError = createSelector(
  cartItems,
  fioDomains,
  (cartItems, fioDomains) => {
    const cartAddressItemsDomains = cartItems
      .filter(cartItem => !!cartItem.address)
      .map(({ domain }) => domain)
      .reduce((acc: { [domain: string]: string }, domain) => {
        acc[domain] = domain;

        return acc;
      }, {});

    let pubKey = '';
    for (const domain of Object.values(cartAddressItemsDomains)) {
      const fioDomain = fioDomains.find(
        ({ name, isPublic }) => name === domain && !isPublic,
      );

      if (fioDomain && !pubKey) pubKey = fioDomain.walletPublicKey;
      if (fioDomain && pubKey !== fioDomain.walletPublicKey) return true;
    }

    return false;
  },
);

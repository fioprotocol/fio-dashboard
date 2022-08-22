import { createSelector } from 'reselect';

import { prefix } from './actions';

import { fioDomains } from '../fio/selectors';
import { domains } from '../registrations/selectors';

import { ReduxState } from '../init';
import { CartItem } from '../../types';

export const cartItems = (state: ReduxState): CartItem[] =>
  state[prefix].cartItems || [];
export const paymentWalletPublicKey = (state: ReduxState): string =>
  state[prefix].paymentWalletPublicKey || '';
export const cartDate = (state: ReduxState): number | null =>
  state[prefix].date || null;

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
          cartItem.hasCustomDomain)
      )
        return true;
    }

    return false;
  },
);

import { setFioName } from '../../utils';

import {
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
} from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';

import { RegistrationType } from './types';
import { CartItem } from '../../types';

export const makeRegistrationOrder = (
  cartItems: CartItem[],
  fees: { address: number; domain: number },
  isFreeAllowed: boolean,
): RegistrationType[] => {
  const registrations = [];
  for (const cartItem of cartItems.sort(item =>
    !!item.address && item.domainType === DOMAIN_TYPE.CUSTOM ? -1 : 1,
  )) {
    const registration: RegistrationType = {
      cartItemId: cartItem.id,
      fioName: setFioName(cartItem.address, cartItem.domain),
      isFree:
        isFreeAllowed &&
        (!cartItem.costNativeFio ||
          cartItem.domainType === DOMAIN_TYPE.FREE ||
          cartItem.domainType === DOMAIN_TYPE.PRIVATE) &&
        !!cartItem.address,
      fee: [CART_ITEM_TYPE.DOMAIN_RENEWAL, CART_ITEM_TYPE.ADD_BUNDLES].includes(
        cartItem.type,
      )
        ? cartItem.costNativeFio
        : cartItem.address
        ? fees.address
        : fees.domain,
      type: cartItem.type,
    };

    if (
      !cartItem.costNativeFio ||
      cartItem.domainType === DOMAIN_TYPE.FREE ||
      cartItem.domainType === DOMAIN_TYPE.PRIVATE ||
      !cartItem.address
    ) {
      registrations.push(registration);

      if (
        CART_ITEM_TYPES_WITH_PERIOD.includes(cartItem.type) &&
        cartItem.period > 1
      ) {
        for (let i = 1; i < cartItem.period; i++) {
          registrations.push({
            cartItemId: cartItem.id,
            fioName: cartItem.domain,
            fee: fees.domain,
            type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
            isFree: false,
            iteration: i,
          });
        }
      }
      continue;
    }

    if (!!cartItem.address && cartItem.domainType === DOMAIN_TYPE.CUSTOM) {
      registrations.push({
        cartItemId: cartItem.id,
        fioName: cartItem.domain,
        fee: fees.domain,
        type: CART_ITEM_TYPE.DOMAIN,
        isFree: false,
        isCustomDomain: true,
      });
    }

    if (
      CART_ITEM_TYPES_WITH_PERIOD.includes(cartItem.type) &&
      cartItem.period > 1
    ) {
      for (let i = 1; i < cartItem.period; i++) {
        registrations.push({
          cartItemId: cartItem.id,
          fioName: cartItem.domain,
          fee: fees.domain,
          type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
          isFree: false,
          iteration: i,
        });
      }
    }

    registrations.push(registration);
  }

  console.log('registrations', registrations);

  return registrations;
};

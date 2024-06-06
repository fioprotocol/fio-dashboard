import { setFioName } from '../../utils';

import {
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
} from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';

import { RegistrationType } from './types';
import { CartItem, NativePrices } from '../../types';

export type MakeRegistrationOrder = {
  fees: NativePrices;
  cartItems?: CartItem[];
  isComboSupport?: boolean;
};

export const makeRegistrationOrder = ({
  cartItems = [],
  fees,
  isComboSupport = false,
}: MakeRegistrationOrder): RegistrationType[] => {
  const registrations = [];
  const sortedCartItems = [...cartItems].sort(item =>
    !!item.address &&
    item.domainType === DOMAIN_TYPE.CUSTOM &&
    !item.hasCustomDomainInCart
      ? -1
      : 1,
  );

  for (const cartItem of sortedCartItems) {
    const isCombo =
      cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN &&
      isComboSupport &&
      !cartItem.hasCustomDomainInCart;

    const registration: RegistrationType = {
      cartItemId: cartItem.id,
      fioName: setFioName(cartItem.address, cartItem.domain),
      isFree:
        cartItem.isFree &&
        (cartItem.domainType === DOMAIN_TYPE.ALLOW_FREE ||
          cartItem.domainType === DOMAIN_TYPE.PRIVATE) &&
        !!cartItem.address &&
        cartItem.type === CART_ITEM_TYPE.ADDRESS,
      fee: [CART_ITEM_TYPE.DOMAIN_RENEWAL, CART_ITEM_TYPE.ADD_BUNDLES].includes(
        cartItem.type,
      )
        ? cartItem.costNativeFio
        : cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN &&
          isComboSupport &&
          !cartItem.hasCustomDomainInCart
        ? fees.combo
        : cartItem.address
        ? fees.address
        : fees.domain,
      isCombo,
      type:
        !isCombo && cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
          ? CART_ITEM_TYPE.ADDRESS
          : cartItem.type,
    };

    if (
      cartItem.isFree ||
      cartItem.domainType === DOMAIN_TYPE.ALLOW_FREE ||
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

    if (
      !!cartItem.address &&
      !isComboSupport &&
      !cartItem.hasCustomDomainInCart &&
      cartItem.domainType === DOMAIN_TYPE.CUSTOM
    ) {
      registrations.push({
        cartItemId: cartItem.id,
        fioName: cartItem.domain,
        fee: fees.domain,
        type: CART_ITEM_TYPE.DOMAIN,
        isFree: false,
        isCustomDomain: true,
      });
    }

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
  }

  return registrations;
};

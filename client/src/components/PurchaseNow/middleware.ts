import { GenericAction } from '@fioprotocol/fiosdk';

import { setFioName } from '../../utils';

import {
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
} from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';

import { RegistrationType } from './types';
import { CartItem, NativePrices } from '../../types';
import { actionFromCartItem } from '../../util/cart';

export type MakeRegistrationOrder = {
  fees: NativePrices;
  displayOrderItems?: CartItem[];
  isComboSupported?: boolean;
};

export const makeRegistrationOrder = ({
  displayOrderItems = [],
  fees,
  isComboSupported = false,
}: MakeRegistrationOrder): RegistrationType[] => {
  const registrations: RegistrationType[] = [];
  const sortedDisplayOrderItems = [...displayOrderItems].sort(item =>
    !!item.address &&
    item.domainType === DOMAIN_TYPE.CUSTOM &&
    !item.hasCustomDomainInCart
      ? -1
      : 1,
  );

  for (const item of sortedDisplayOrderItems) {
    const isCombo =
      item.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN &&
      isComboSupported &&
      !item.hasCustomDomainInCart;

    const registration: RegistrationType = {
      cartItemId: item.id,
      fioName: setFioName(item.address, item.domain),
      isFree:
        item.isFree &&
        (item.domainType === DOMAIN_TYPE.ALLOW_FREE ||
          item.domainType === DOMAIN_TYPE.PRIVATE) &&
        !!item.address &&
        item.type === CART_ITEM_TYPE.ADDRESS,
      action: actionFromCartItem(item.type, isCombo),
      fee: [CART_ITEM_TYPE.DOMAIN_RENEWAL, CART_ITEM_TYPE.ADD_BUNDLES].includes(
        item.type,
      )
        ? item.costNativeFio
        : item.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN &&
          isComboSupported &&
          !item.hasCustomDomainInCart
        ? fees?.combo
        : item.address
        ? fees?.address
        : fees?.domain,
      isCombo,
      type:
        !isCombo && item.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
          ? CART_ITEM_TYPE.ADDRESS
          : item.type,
      signInFioWallet: item.signInFioWallet,
    };

    if (
      item.isFree ||
      item.domainType === DOMAIN_TYPE.ALLOW_FREE ||
      item.domainType === DOMAIN_TYPE.PRIVATE ||
      !item.address
    ) {
      registrations.push(registration);

      if (CART_ITEM_TYPES_WITH_PERIOD.includes(item.type) && item.period > 1) {
        for (let i = 1; i < item.period; i++) {
          registrations.push({
            action: GenericAction.renewFioDomain,
            fioName: item.domain,
            cartItemId: item.id,
            fee: fees?.renewDomain,
            type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
            isFree: false,
            iteration: i,
            signInFioWallet: item.signInFioWallet,
          });
        }
      }
      continue;
    }

    if (
      !!item.address &&
      !isComboSupported &&
      !item.hasCustomDomainInCart &&
      item.domainType === DOMAIN_TYPE.CUSTOM
    ) {
      registrations.push({
        action: GenericAction.registerFioDomain,
        fioName: item.domain,
        cartItemId: item.id,
        fee: fees?.domain,
        type: CART_ITEM_TYPE.DOMAIN,
        isFree: false,
        isCustomDomain: true,
        signInFioWallet: item.signInFioWallet,
      });
    }

    registrations.push(registration);

    if (CART_ITEM_TYPES_WITH_PERIOD.includes(item.type) && item.period > 1) {
      for (let i = 1; i < item.period; i++) {
        registrations.push({
          fioName: item.domain,
          action: GenericAction.renewFioDomain,
          cartItemId: item.id,
          fee: fees?.renewDomain,
          type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
          isFree: false,
          iteration: i,
          signInFioWallet: item.signInFioWallet,
        });
      }
    }
  }

  return registrations;
};

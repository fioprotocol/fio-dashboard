import isEmpty from 'lodash/isEmpty';
import { History } from 'history';

import { FIO_ADDRESS_DELIMITER, isDomain } from '../utils';
import { convertFioPrices } from './prices';
import MathOp from './math';

import { ROUTES } from '../constants/routes';
import { ERROR_TYPES } from '../constants/errors';

import { RegistrationResult, CartItem, Prices, Order } from '../types';

export const onPurchaseFinish = ({
  order,
  isCheckout,
  history,
  setProcessing,
}: {
  order: Order;
  isCheckout?: boolean;
  history: History;
  setProcessing: (isProcessing: boolean) => void;
}): void => {
  setProcessing(false);

  if (isCheckout) {
    history.push(
      { pathname: ROUTES.PURCHASE, search: `orderNumber=${order.number}` },
      {
        orderId: order.id,
      },
    );
  }
};

export const transformPurchaseResults = ({
  results,
  cart,
  prices,
  roe,
}: {
  results: RegistrationResult | null;
  cart: CartItem[];
  prices: Prices;
  roe: number;
}): { errItems: CartItem[]; regItems: CartItem[]; updatedCart: CartItem[] } => {
  const errItems: CartItem[] = [];
  const regItems: CartItem[] = [];

  const updatedCart = [...cart];

  if (!results) return { errItems, regItems, updatedCart };

  const { registered, errors, partial } = results;

  const {
    nativeFio: { address: nativeFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  if (!isEmpty(errors)) {
    for (const item of errors) {
      const { fioName, error, errorData, isFree, cartItemId, errorType } = item;

      const retObj: CartItem = {
        id: fioName,
        domain: '',
      };

      const partialIndex = partial && partial.indexOf(cartItemId);
      if (isDomain(fioName)) {
        retObj.domain = fioName;
        retObj.costNativeFio = nativeFioDomainPrice;
      } else {
        const name = fioName.split(FIO_ADDRESS_DELIMITER);
        const addressName = name[0];
        const domainName = name[1];

        retObj.address = addressName;
        retObj.domain = domainName;
        retObj.error = error;
        retObj.errorType = errorType;
        retObj.errorData = errorData;

        if (isFree) {
          retObj.isFree = isFree;
          if (errorType === ERROR_TYPES.freeAddressIsNotRegistered) {
            updatedCart.splice(
              cart.findIndex(({ id }) => cartItemId === id),
              1,
            );
          }
        } else {
          if (
            cart.find(
              cartItem =>
                cartItem.id === cartItemId && cartItem.hasCustomDomain,
            ) &&
            partialIndex < 0
          ) {
            retObj.costNativeFio = new MathOp(nativeFioAddressPrice)
              .add(nativeFioDomainPrice)
              .toNumber();
          } else {
            retObj.costNativeFio = nativeFioAddressPrice;
          }
        }
      }

      const fioPrices = convertFioPrices(retObj.costNativeFio, roe);
      retObj.costFio = fioPrices.fio;
      retObj.costUsdc = fioPrices.usdc;

      errItems.push(retObj);
      if (partialIndex > 0) {
        updatedCart.splice(partialIndex, 1, retObj);
      }
    }
  }

  if (!isEmpty(registered)) {
    for (const item of registered) {
      const { fioName, isFree, fee_collected } = item;

      const retObj: CartItem = {
        id: fioName,
        domain: '',
      };

      if (!isDomain(fioName)) {
        const name = fioName.split(FIO_ADDRESS_DELIMITER);
        const addressName = name[0];
        const domainName = name[1];

        retObj.address = addressName;
        retObj.domain = domainName;

        if (isFree) {
          retObj.isFree = isFree;
        } else {
          retObj.costNativeFio = fee_collected;
        }
      } else {
        retObj.domain = fioName;
        retObj.costNativeFio = fee_collected;
      }

      const fioPrices = convertFioPrices(fee_collected, roe);
      retObj.costFio = fioPrices.fio;
      retObj.costUsdc = fioPrices.usdc;

      regItems.push(retObj);

      for (let i = updatedCart.length - 1; i >= 0; i--) {
        if (updatedCart[i].id === fioName) {
          updatedCart.splice(i, 1);
        }
      }
    }
  }

  return { errItems, regItems, updatedCart };
};

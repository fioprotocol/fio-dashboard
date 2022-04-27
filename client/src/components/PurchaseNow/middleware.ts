import apis from '../../api/index';
import { toString } from '../../redux/notify/sagas';
import { FIO_ADDRESS_DELIMITER } from '../../utils';
import { waitForAddressRegistered } from '../../util/fio';
import { log } from '../../util/general';

import { ERROR_TYPES } from '../../constants/errors';
import { RegistrationType } from './types';
import {
  CartItem,
  RegistrationResult,
  WalletKeys,
  RegistrationRegistered,
  AnyObject,
} from '../../types';

const TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION = 2000;
const wait = () =>
  new Promise(resolve =>
    setTimeout(resolve, TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION),
  );

export const registerFree = async ({
  fioName,
  cartItemId,
  publicKey,
  verifyParams,
  refCode = '',
}: {
  fioName: string;
  cartItemId: string;
  publicKey: string;
  verifyParams: {};
  refCode?: string;
}): Promise<{
  cartItemId: string;
  fioName: string;
  isFree: boolean;
  error?: string;
  errorType?: string;
}> => {
  let result: {
    cartItemId: string;
    fioName: string;
    isFree: boolean;
    error?: string;
    errorType?: string;
  } = {
    cartItemId,
    fioName,
    isFree: true,
  };

  try {
    const res = await apis.fioReg.register({
      address: fioName,
      publicKey,
      verifyParams,
      refCode,
    });
    if (res.error) {
      result.error = res.error;
      result.errorType = ERROR_TYPES.default;
    } else {
      await waitForAddressRegistered(fioName);
      result = { ...res, ...result };
    }
  } catch (e) {
    result.error = e.message || toString(e.fields);
    result.errorType = e.errorType || ERROR_TYPES.default;
  }
  return result;
};

export const register = async ({
  fioName,
  fee,
  cartItemId,
}: {
  fioName: string;
  fee: number;
  cartItemId: string;
  error?: string;
  errorType?: string;
}): Promise<{
  cartItemId: string;
  fioName: string;
  error?: string;
  errorType?: string;
}> => {
  let result: {
    cartItemId: string;
    fioName: string;
    error?: string;
    errorType?: string;
  } = { cartItemId, fioName };
  try {
    const res = await apis.fio.register(fioName, fee);

    if (!res) {
      throw new Error('Server Error');
    }

    result = { ...result, ...res };
  } catch (e) {
    log.error(e.json);
    result.error = apis.fio.extractError(e.json) || e.message;
    result.errorType = e.errorType || ERROR_TYPES.default;
  }

  return result;
};

export const executeRegistration = async (
  items: CartItem[],
  keys: WalletKeys,
  fees: { address: number; domain: number },
  verifyParams = {},
  refCode = '',
): Promise<RegistrationResult> => {
  const result: RegistrationResult = {
    errors: [],
    registered: [],
    partial: [],
  };
  const registrations = makeRegistrationOrder([...items], fees);
  const registrationPromises = [];
  const dependedRegistrationPromises = [];

  if (keys.private) apis.fio.setWalletFioSdk(keys);
  try {
    let hasDepended = false;
    for (const registration of registrations) {
      if (registration.depended) {
        hasDepended = true;
        continue;
      }
      registrationPromises.push(
        makeRegistrationPromise(registration, keys, verifyParams, refCode),
      );
    }

    const responses = await Promise.allSettled(registrationPromises);
    handleResponses(responses, result);

    // todo: could be improved to handle inherit dependencies
    // depended registrations
    if (hasDepended) await wait();
    for (const registration of registrations) {
      if (!registration.depended) continue;
      dependedRegistrationPromises.push(
        makeRegistrationPromise(registration, keys, verifyParams, refCode),
      );
    }

    const dependedResponses = await Promise.allSettled(
      dependedRegistrationPromises,
    );
    handleResponses(dependedResponses, result);
  } catch (e) {
    //
  }
  if (keys.private) apis.fio.clearWalletFioSdk();

  return result;
};

const makeRegistrationOrder = (
  cartItems: CartItem[],
  fees: { address: number; domain: number },
): {
  cartItemId: string;
  fioName: string;
  fee: number;
  isFree: boolean;
  isCustomDomain?: boolean;
  depended?: { domain: string };
}[] => {
  const registrations = [];
  for (const cartItem of cartItems.sort(item =>
    item.hasCustomDomain ? -1 : 1,
  )) {
    const registration: RegistrationType = {
      cartItemId: cartItem.id,
      fioName: cartItem.address
        ? `${cartItem.address}${FIO_ADDRESS_DELIMITER}${cartItem.domain}`
        : cartItem.domain,
      isFree: !cartItem.costNativeFio,
      fee: cartItem.address ? fees.address : fees.domain,
    };

    if (!cartItem.costNativeFio || !cartItem.address) {
      registrations.push(registration);
      continue;
    }

    const customDomainRegistration = registrations.find(
      item => item.isCustomDomain && item.fioName === cartItem.domain,
    );
    if (customDomainRegistration) {
      registration.depended = { domain: cartItem.domain };
    }

    if (cartItem.hasCustomDomain) {
      registrations.push({
        cartItemId: cartItem.id,
        fioName: cartItem.domain,
        fee: fees.domain,
        isFree: false,
        isCustomDomain: true,
      });
      registration.depended = { domain: cartItem.domain };
    }

    registrations.push(registration);
  }

  return registrations;
};

const makeRegistrationPromise = (
  registration: RegistrationType,
  keys: WalletKeys,
  verifyParams = {},
  refCode = '',
) => {
  return registration.isFree
    ? registerFree({
        ...registration,
        publicKey: keys.public,
        verifyParams,
        refCode,
      })
    : register(registration);
};

const handleResponses = (
  responses: PromiseSettledResult<{
    cartItemId: string;
    fioName: string;
    error?: string;
    errorType?: string;
    fee_collected?: number;
  }>[] &
    AnyObject, // todo: check this ts issue, for status === 'rejected' there is no value
  result: RegistrationResult,
) => {
  for (const response of responses) {
    const responseValue = response.value;
    const existingCartItemErrorIndex = result.errors.findIndex(
      item => item.cartItemId === responseValue.cartItemId,
    );
    const existingCartItemRegisteredIndex = result.registered.findIndex(
      item => item.cartItemId === responseValue.cartItemId,
    );
    if (response.status === 'rejected' || response.value.error) {
      if (existingCartItemErrorIndex > -1) {
        result.errors[existingCartItemErrorIndex] = {
          ...result.errors[existingCartItemErrorIndex],
          ...responseValue,
        };
        continue;
      }
      if (existingCartItemRegisteredIndex > -1) {
        result.partial.push(responseValue.cartItemId);
      }
      result.errors.push(response.value);
    } else {
      if (existingCartItemRegisteredIndex > -1) {
        result.registered[existingCartItemRegisteredIndex] = {
          ...result.registered[existingCartItemRegisteredIndex],
          ...response.value,
          fee_collected: combineFee(
            result.registered[existingCartItemRegisteredIndex],
            response.value,
          ),
        };
        continue;
      }
      if (existingCartItemErrorIndex > -1) {
        result.partial.push(response.value.cartItemId);
      }
      result.registered.push(response.value);
    }
  }
};

const combineFee = (
  registered1: RegistrationRegistered,
  registered2: RegistrationRegistered,
) => {
  if (!registered1.fee_collected) return null;

  return registered1.fee_collected + registered2.fee_collected;
};

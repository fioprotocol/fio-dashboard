import apis from '../../api/index';
import { toString } from '../../redux/notify/sagas';
import { FIO_ADDRESS_DELIMITER } from '../../utils';

const TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION = 2000;
const wait = () =>
  new Promise(resolve =>
    setTimeout(resolve, TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION),
  );

/**
 *
 * @param registration
 * @param registration.fioName
 * @param registration.cartItemId
 * @param registration.publicKey
 * @param registration.verifyParams
 * @returns {Promise<{isFree: boolean, fioName: string}>}
 */
export const registerFree = async ({
  fioName,
  cartItemId,
  publicKey,
  verifyParams,
  refCode = '',
}) => {
  let result = { cartItemId, fioName, isFree: true };

  try {
    const res = await apis.fioReg.register({
      address: fioName,
      publicKey,
      verifyParams,
      refCode,
    });
    if (res.error) {
      result.error = res.error;
    } else {
      result = { ...res, ...result };
    }
  } catch (e) {
    result.error = e.message || toString(e.fields);
  }
  return result;
};

/**
 *
 * @param item
 * @param item.fioName
 * @param item.cartItemId
 * @param item.fee
 * @returns {Promise<{cartItemId: string, fioName: string}>}
 */
export const register = async ({ fioName, fee, cartItemId }) => {
  let result = { cartItemId, fioName };
  try {
    const res = await apis.fio.register(fioName, fee);

    if (!res) {
      throw new Error('Server Error');
    }

    result = { ...result, ...res };
  } catch (e) {
    console.error(e.json);
    result.error = apis.fio.extractError(e.json) || e.message;
  }

  return result;
};

/**
 *
 * @param items[]
 * @param items[].id
 * @param items[].address
 * @param items[].domain
 * @param items[].costFio
 * @param items[].costUsdc
 * @param items[].hasCustomDomain
 * @param keys
 * @param fees
 * @param fees.address
 * @param fees.domain
 * @param verifyParams
 * @param refCode
 * @returns {Promise<{registered: [], errors: []}>}
 */
export const executeRegistration = async (
  items,
  keys,
  fees,
  verifyParams = {},
  refCode = '',
) => {
  const result = { errors: [], registered: [], partial: [] };
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

/**
 *
 * @param cartItems[]
 * @param cartItems[].id
 * @param cartItems[].address
 * @param cartItems[].domain
 * @param cartItems[].costFio
 * @param cartItems[].costUsdc
 * @param cartItems[].hasCustomDomain
 * @param fees
 * @param fees.address
 * @param fees.domain
 * @returns {{ cartItemId: string, fioName: string, isFree:boolean, fee?:number, depended?: { domain?:string }, isCustomDomain?: boolean }[]}
 */
const makeRegistrationOrder = (cartItems, fees) => {
  const registrations = [];
  for (const cartItem of cartItems.sort(item =>
    item.hasCustomDomain ? -1 : 1,
  )) {
    const registration = {
      cartItemId: cartItem.id,
      fioName: cartItem.address
        ? `${cartItem.address}${FIO_ADDRESS_DELIMITER}${cartItem.domain}`
        : cartItem.domain,
      isFree: !cartItem.costFio,
      fee: cartItem.address ? fees.address : fees.domain,
    };

    if (!cartItem.costFio || !cartItem.address) {
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

/**
 *
 * @param registration
 * @param registration.cartItemId
 * @param registration.fioName
 * @param registration.isFree
 * @param registration.fee
 * @param keys
 * @param verifyParams
 * @param refCode
 * @returns {*}
 */
const makeRegistrationPromise = (
  registration,
  keys,
  verifyParams,
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

/**
 *
 * @param {Array<Object>} responses
 * @param {Object} result
 * @param {Array<Object>} result.errors
 * @param {Array<Object>} result.registered
 * @param {Array<string>} result.partial
 */
const handleResponses = (responses, result) => {
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
          ...response.value,
        };
        continue;
      }
      if (existingCartItemRegisteredIndex > -1) {
        result.partial.push(response.value.cartItemId);
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

const combineFee = (registered1, registered2) => {
  if (!registered1.fee_collected) return null;

  return registered1.fee_collected + registered2.fee_collected;
};

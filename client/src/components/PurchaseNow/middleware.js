import apis from '../../api/index';
import { toString } from '../../redux/notify/sagas';
import { FIO_ADDRESS_DELIMITER } from '../../utils';

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
}) => {
  let result = { cartItemId, fioName, isFree: true };

  try {
    const res = await apis.fioReg.register({
      address: fioName,
      publicKey,
      verifyParams,
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
 * @param items[].isCustomDomain
 * @param keys
 * @param fees
 * @param fees.address
 * @param fees.domain
 * @param verifyParams
 * @returns {Promise<{registered: [], errors: []}>}
 */
export const executeRegistration = async (
  items,
  keys,
  fees,
  verifyParams = {},
) => {
  const result = { errors: [], registered: [] };
  const registrations = makeRegistrationOrder([...items], fees);
  const registrationPromises = [];
  const dependedRegistrationPromises = [];

  if (keys.private) apis.fio.setWalletFioSdk(keys);
  try {
    for (const registration of registrations) {
      if (registration.depended) continue;
      registrationPromises.push(
        makeRegistrationPromise(registration, keys, verifyParams),
      );
    }

    const responses = await Promise.allSettled(registrationPromises);
    handleResponses(responses, result);

    // todo: could be improved to handle inherit dependencies
    // depended registrations
    for (const registration of registrations) {
      if (!registration.depended) continue;
      dependedRegistrationPromises.push(
        makeRegistrationPromise(registration, keys, verifyParams),
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
 * @param cartItems[].isCustomDomain
 * @param fees
 * @param fees.address
 * @param fees.domain
 * @returns {{ cartItemId: string, fioName: string, isFree:boolean, fee?:number, depended?: { domain?:string }, isCustomDomain?: boolean }[]}
 */
const makeRegistrationOrder = (cartItems, fees) => {
  const registrations = [];
  for (const cartItem of cartItems.sort(item =>
    item.isCustomDomain ? -1 : 1,
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

    if (cartItem.isCustomDomain) {
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
 * @returns {*}
 */
const makeRegistrationPromise = (registration, keys, verifyParams) => {
  return registration.isFree
    ? registerFree({
        ...registration,
        publicKey: keys.public,
        verifyParams,
      })
    : register(registration);
};

/**
 *
 * @param responses[]
 * @param result
 * @param result.errors
 * @param result.registered
 */
const handleResponses = (responses, result) => {
  for (const response of responses) {
    if (response.status === 'rejected' || response.value.error) {
      result.errors.push(response.value);
    } else {
      result.registered.push(response.value);
    }
  }
};

import apis from '../../api/index';
import { toString } from '../../redux/notify/sagas';
import { FIO_ADDRESS_DELIMITER } from '../../utils';

/**
 *
 * @param fioName
 * @param publicKey
 * @param verifyParams
 * @returns {Promise<{isFree: boolean, fioName: *}>}
 */
export const registerFree = async ({ fioName, publicKey, verifyParams }) => {
  let result = { fioName, isFree: true };

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
 * @param fioName
 * @param fee
 * @param costFio
 * @param hasCustomDomain
 * @returns {Promise<{fioName: *}>}
 */
export const register = async ({
  fioName,
  fee,
  costFio,
  hasCustomDomain = false,
}) => {
  let result = { fioName };
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
 * @param items
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
  const registrations = [];
  if (keys.private) apis.fio.setWalletFioSdk(keys);
  try {
    for (const item of items) {
      const fioName = item.address
        ? `${item.address}${FIO_ADDRESS_DELIMITER}${item.domain}`
        : item.domain;
      if (item.costFio) {
        registrations.push(
          register({
            fioName,
            fee: item.address ? fees.address : fees.domain,
            costFio: item.costFio,
          }),
        );
      } else {
        registrations.push(
          registerFree({ fioName, publicKey: keys.public, verifyParams }),
        );
      }
    }

    const responses = await Promise.allSettled(registrations);

    for (const response of responses) {
      if (response.status === 'rejected' || response.value.error) {
        result.errors.push(response.value);
      } else {
        result.registered.push(response.value);
      }
    }
  } catch (e) {
    //
  }
  if (keys.private) apis.fio.clearWalletFioSdk();

  return result;
};

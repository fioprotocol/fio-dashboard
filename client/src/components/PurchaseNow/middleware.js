import apis from '../../api/index';
import { toString } from '../../redux/notify/sagas';
import { FIO_ADDRESS_DELIMITER } from '../../utils';

export const registerFree = async (fioName, publicKey, verifyParams) => {
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

export const register = async (fioName, costFio) => {
  let result = { fioName };
  try {
    const res = await apis.fio.register(fioName, apis.fio.amountToSUF(costFio));

    if (!res) {
      throw new Error('Server Error');
    }

    result = { ...result, ...res };
  } catch (e) {
    console.error(e.json);
    result.error =
      e.json && e.json.fields && e.json.fields[0]
        ? e.json.fields[0].error
        : e.message;
  }

  return result;
};

export const executeRegistration = async (items, keys, verifyParams = {}) => {
  const result = { errors: [], registered: [] };
  const registrations = [];
  if (keys.private) apis.fio.setWalletFioSdk(keys);
  try {
    for (const item of items) {
      const fioName = item.address
        ? `${item.address}${FIO_ADDRESS_DELIMITER}${item.domain}`
        : item.domain;
      if (item.costFio) {
        registrations.push(register(fioName, item.costFio));
      } else {
        registrations.push(registerFree(fioName, keys.public, verifyParams));
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

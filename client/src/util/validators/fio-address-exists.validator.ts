import { FieldValidationFunctionAsync } from '@lemoncode/fonk';

import apis from '../../api';

interface FieldArgs {
  fieldIdToCompare?: string;
  sameWalletMessage?: string;
}

const defaultMessage =
  'FIO Crypto Handle is not valid / not exist / domain expired';

export const fioAddressExistsValidator: FieldValidationFunctionAsync<FieldArgs> = async ({
  value,
  values,
  message = defaultMessage,
  customArgs = {},
}) => {
  const { fieldIdToCompare, sameWalletMessage = 'Spend to self.' } =
    customArgs || {};

  if (!value)
    return {
      type: 'FIO_CRYPTO_HANDLE_EXISTS',
      succeeded: true,
      message: '',
    };

  let transferAddress = value;

  const validationResult = {
    type: 'FIO_CRYPTO_HANDLE_EXISTS',
    succeeded: false,
    message:
      typeof message === 'string'
        ? message
        : message?.[0] || 'FIO Crypto Handle is not valid',
  };

  try {
    apis.fio.isFioAddressValid(value);

    const {
      public_address: publicAddress,
    } = await apis.fio.getFioPublicAddress(value);

    transferAddress = publicAddress;
  } catch (e) {
    //
  }

  try {
    apis.fio.isFioPublicKeyValid(transferAddress);
    await apis.fio.publicFioSDK.getFioBalance(transferAddress);
  } catch (e) {
    if (e.json && e.json.type === 'invalid_input') {
      return validationResult;
    }
    if (!e.json) {
      return validationResult;
    }
  }

  if (fieldIdToCompare && transferAddress === values[fieldIdToCompare]) {
    return {
      ...validationResult,
      message: sameWalletMessage,
    };
  }

  return {
    ...validationResult,
    succeeded: true,
    message: '',
  };
};

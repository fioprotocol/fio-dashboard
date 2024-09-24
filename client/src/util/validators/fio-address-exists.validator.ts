import { FieldValidationFunctionAsync } from '@lemoncode/fonk';

import { FIOSDK } from '@fioprotocol/fiosdk';

import apis from '../../api';

interface FieldArgs {
  fieldIdToCompare?: string;
  sameWalletMessage?: string;
}

const defaultMessage =
  'Invalid FIO Handle or FIO Public Address or FIO Handle domain has expired';

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
      type: 'FIO_HANDLE_EXISTS',
      succeeded: true,
      message: '',
    };

  let transferAddress = value;

  const validationResult = {
    type: 'FIO_HANDLE_EXISTS',
    succeeded: false,
    message:
      typeof message === 'string'
        ? message
        : message?.[0] || 'FIO Handle is not valid',
  };

  if (apis.fio.publicFioSDK.validateFioAddress(value)) {
    const {
      public_address: publicAddress,
    } = await apis.fio.getFioPublicAddress(value);

    transferAddress = publicAddress;
  }

  try {
    FIOSDK.isFioPublicKeyValid(transferAddress);
    await apis.fio.publicFioSDK.getFioBalance({
      fioPublicKey: transferAddress,
    });
  } catch (e) {
    // TODO refactor error handling
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

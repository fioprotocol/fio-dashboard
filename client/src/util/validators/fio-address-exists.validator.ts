import { FieldValidationFunctionAsync } from '@lemoncode/fonk';
import apis from '../../api';

interface FieldArgs {
  fieldIdToCompare?: string;
}

const defaultMessage = 'Please enter valid FIO Address.';

export const fioAddressExistsValidator: FieldValidationFunctionAsync<FieldArgs> = async ({
  value,
  values,
  message = defaultMessage,
  customArgs,
}) => {
  const { fieldIdToCompare } = customArgs;

  let transferAddress = value;

  const validationResult = {
    type: 'FIO_USER_EXISTS',
    succeeded: false,
    message:
      typeof message === 'string'
        ? message
        : message?.[0] || 'Fio address is not valid',
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
      message: 'Spend to self',
    };
  }

  return {
    ...validationResult,
    succeeded: true,
    message: '',
  };
};

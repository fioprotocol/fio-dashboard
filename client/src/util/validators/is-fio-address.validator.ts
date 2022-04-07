import { FieldValidationFunctionSync } from '@lemoncode/fonk';

import apis from '../../api';

interface OnlyFioAddressFieldArgs {
  onlyFioAddress?: boolean;
}

export const isFioAddressValidator: FieldValidationFunctionSync<OnlyFioAddressFieldArgs> = ({
  value,
  message,
  customArgs = {},
}) => {
  const { onlyFioAddress = false } = customArgs;

  const validationResult = {
    type: 'IS_FIO_ADDRESS_VALID',
    succeeded: false,
    message:
      typeof message === 'string'
        ? message
        : message?.[0] || 'FIO Crypto Handle is not valid',
  };

  try {
    apis.fio.isFioAddressValid(value);
    return {
      ...validationResult,
      succeeded: true,
      message: '',
    };
  } catch (e) {
    //
  }

  if (!onlyFioAddress) {
    try {
      apis.fio.isFioPublicKeyValid(value);
      return {
        ...validationResult,
        succeeded: true,
        message: '',
      };
    } catch (e) {
      //
    }
  }

  return validationResult;
};

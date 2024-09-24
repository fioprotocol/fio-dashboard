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
        : message?.[0] || 'FIO Handle is not valid',
  };

  if (apis.fio.publicFioSDK.validateFioAddress(value)) {
    return {
      ...validationResult,
      succeeded: true,
      message: '',
    };
  }

  if (!onlyFioAddress && apis.fio.publicFioSDK.validateFioPublicKey(value)) {
    return {
      ...validationResult,
      succeeded: true,
      message: '',
    };
  }

  return validationResult;
};

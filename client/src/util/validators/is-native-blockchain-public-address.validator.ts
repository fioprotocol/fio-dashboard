import { FieldValidationFunctionSync } from '@lemoncode/fonk';

import apis from '../../api';

export const isNativeBlockchainPublicAddressValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
  const validationResult = {
    type: 'IS_NATIVE_BLOCKCHAIN_PUBLIC_ADDRESS',
    succeeded: false,
    message:
      typeof message === 'string'
        ? message
        : message?.[0] || 'Not valid address',
  };

  if (apis.fio.publicFioSDK.validatePublicAddress(value)) {
    return {
      ...validationResult,
      succeeded: true,
      message: '',
    };
  }

  return validationResult;
};

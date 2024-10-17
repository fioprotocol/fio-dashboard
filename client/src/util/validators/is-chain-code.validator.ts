import { FieldValidationFunctionSync } from '@lemoncode/fonk';

import apis from '../../api';

export const isChainCodeValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
  const validationResult = {
    type: 'IS_CHAIN_CODE',
    succeeded: false,
    message:
      typeof message === 'string'
        ? message
        : message?.[0] || 'Not valid chain code',
  };

  if (apis.fio.publicFioSDK.validateChainCode(value)) {
    return {
      ...validationResult,
      succeeded: true,
      message: '',
    };
  }

  return validationResult;
};

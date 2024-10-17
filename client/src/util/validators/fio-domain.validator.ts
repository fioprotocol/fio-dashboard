import { FieldValidationFunctionSync } from '@lemoncode/fonk';

import apis from '../../api';

export const isFioDomainValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
  const validationResult = {
    type: 'IS_FIO_DOMAIN_VALID',
    succeeded: false,
    message:
      typeof message === 'string'
        ? message
        : message?.[0] || 'FIO Domain is not valid',
  };

  if (apis.fio.publicFioSDK.validateFioDomain(value)) {
    return {
      ...validationResult,
      succeeded: true,
      message: '',
    };
  }

  return validationResult;
};

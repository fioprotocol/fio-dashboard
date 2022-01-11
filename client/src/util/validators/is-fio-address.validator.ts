import { FieldValidationFunctionSync } from '@lemoncode/fonk';
import apis from '../../api';

export const isFioAddressValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
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

  return validationResult;
};

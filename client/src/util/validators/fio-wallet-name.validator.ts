import { FieldValidationFunctionSync } from '@lemoncode/fonk';

import { WALLET_NAME_REGEX } from '../../constants/regExps';

export const fioWalletNameValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
  const succeeded = WALLET_NAME_REGEX.test(value);

  const messageString = succeeded
    ? ''
    : typeof message === 'string'
    ? message
    : message?.[0] ||
      'Name is not valid. Name should be from 1 to 32 symbols and contain only letters, digits, spaces, dashes or underscores.';

  return {
    succeeded,
    message: messageString,
    type: 'FIO_WALLET_NAME',
  };
};

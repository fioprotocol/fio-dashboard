import { FieldValidationFunctionSync } from '@lemoncode/fonk';

const HASH_REGEX = /^[a-f0-9]{64}$/i;

export const isHashValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
  const succeeded = HASH_REGEX.test(value);

  const messageString = succeeded
    ? ''
    : typeof message === 'string'
    ? message
    : message?.[0] || 'Not valid hash';

  return {
    succeeded,
    message: messageString,
    type: 'IS_HASH',
  };
};

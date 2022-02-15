import { FieldValidationFunctionSync } from '@lemoncode/fonk';

export const hasNumberCharValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
  const succeeded = value.search(/^(?=.*\d)/) >= 0;

  const messageString = succeeded
    ? ''
    : typeof message === 'string'
    ? message
    : message?.[0] || 'Should contain number char.';

  return {
    succeeded,
    message: messageString,
    type: 'HAS_NUMBER_CHAR',
  };
};

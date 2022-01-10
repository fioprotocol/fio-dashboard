import { FieldValidationFunctionSync } from '@lemoncode/fonk';

export const isNumberValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
  const succeeded = !isNaN(value);

  const messageString = succeeded
    ? ''
    : typeof message === 'string'
    ? message
    : message?.[0] || 'Should be number';

  return {
    succeeded,
    message: messageString,
    type: 'IS_NUMBER',
  };
};

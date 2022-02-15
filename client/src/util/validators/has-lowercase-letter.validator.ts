import { FieldValidationFunctionSync } from '@lemoncode/fonk';

export const hasLowercaseLetterValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
  const succeeded = value.search(/^(?=.*[a-z])/) >= 0;

  const messageString = succeeded
    ? ''
    : typeof message === 'string'
    ? message
    : message?.[0] || 'Should contain lowercase letter.';

  return {
    succeeded,
    message: messageString,
    type: 'HAS_LOWERCASE_LETTER',
  };
};

import { FieldValidationFunctionSync } from '@lemoncode/fonk';

export const hasUppercaseLetterValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
  const succeeded = value.search(/^(?=.*[A-Z])/) >= 0;

  const messageString = succeeded
    ? ''
    : typeof message === 'string'
    ? message
    : message?.[0] || 'Should contain uppercase letter.';

  return {
    succeeded,
    message: messageString,
    type: 'HAS_UPPERCASE_LETTER',
  };
};
